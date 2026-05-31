"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Team, Burst } from "@/utils/constants";

type RankChange = "up" | "down" | "same";

interface LastEvent {
	name: string;
	points: number;
}

export function useScoreboard() {
	const [teams, setTeams] = useState<Team[]>([]);
	const [loading, setLoading] = useState(true);
	const [scoringTeamId, setScoringTeamId] = useState<string | null>(null);
	const [lastPoints, setLastPoints] = useState(0);
	const [lastEvent, setLastEvent] = useState<LastEvent | null>(null);
	const [burst, setBurst] = useState<Burst | null>(null);
	const burstIdRef = useRef(0);

	useEffect(() => {
		const supabase = createClient();

		const loadTeams = async () => {
			const req = await fetch("/api/teams");
			const { teams } = await req.json();
			if (teams) setTeams(teams as Team[]);
			setLoading(false);
		};

		loadTeams();

		const channel = supabase
			.channel("teams-live")
			.on("postgres_changes", { event: "UPDATE", schema: "public", table: "teams" }, (payload) => {
				const updated = payload.new as Team;
				setTeams((prev) => {
					const existing = prev.find((t) => t.id === updated.id);
					if (!existing) return prev;
					const pointsGained = updated.score - existing.score;
					if (pointsGained <= 0) return prev.map((t) => (t.id === updated.id ? updated : t));

					burstIdRef.current += 1;
					setScoringTeamId(updated.id);
					setLastPoints(pointsGained);
					setLastEvent({ name: updated.name, points: pointsGained });
					setBurst({
						id: burstIdRef.current,
						teamName: updated.name,
						teamColor: updated.designation === "blue" ? "#1890ff" : "#F8372D",
						points: pointsGained,
					});
					setTimeout(() => {
						setScoringTeamId(null);
						setLastEvent(null);
						setBurst(null);
					}, 2500);
					return prev.map((t) => (t.id === updated.id ? updated : t));
				});
			})
			.on("postgres_changes", { event: "INSERT", schema: "public", table: "teams" }, (payload) => {
				setTeams((prev) => [...prev, payload.new as Team]);
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const sorted = [...teams].sort((a, b) => b.score - a.score);
	const sortedIds = sorted.map((t) => t.id);

	const [prevOrder, setPrevOrder] = useState<string[]>([]);
	useEffect(() => {
		if (teams.length > 0) setPrevOrder(sortedIds);
	}, [teams]);

	const rankChanges = new Map<string, RankChange>();
	if (prevOrder.length > 0) {
		for (const team of sorted) {
			const prevIdx = prevOrder.indexOf(team.id);
			const currIdx = sortedIds.indexOf(team.id);
			if (prevIdx > currIdx) rankChanges.set(team.id, "up");
			else if (prevIdx < currIdx) rankChanges.set(team.id, "down");
			else rankChanges.set(team.id, "same");
		}
	}

	const topScore = sorted[0]?.score || 1;
	const blueTeams = sorted.filter((t) => t.designation === "blue");
	const redTeams = sorted.filter((t) => t.designation === "red");

	return {
		teams,
		loading,
		scoringTeamId,
		lastPoints,
		lastEvent,
		burst,
		rankChanges,
		topScore,
		blueTeams,
		redTeams,
	};
}
