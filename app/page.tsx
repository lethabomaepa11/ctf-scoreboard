"use client";

import { useState, useEffect, useRef } from "react";
import { Typography, Spin } from "antd";
import { motion } from "framer-motion";
const { Text } = Typography;
import { getTeamColor, type Team, type Burst } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { TYPING_CHANNEL, getRandomTypingText } from "@/utils/realtime-typing";
import Confetti from "@/components/Confetti";
import ScoreAnnouncement, { ScoreFlash } from "@/components/ScoreAnnouncement";
import ScoreboardHeader from "@/components/ScoreboardHeader";
import LeaderboardRow from "@/components/LeaderboardRow";
import TerminalOutput from "@/components/animations/TerminalOutput";

export default function Home() {
	const [teams, setTeams] = useState<Team[]>([]);
	const [loading, setLoading] = useState(true);
	const [scoringTeamId, setScoringTeamId] = useState<string | null>(null);
	const [lastPoints, setLastPoints] = useState(0);
	const [lastEvent, setLastEvent] = useState<{
		name: string;
		points: number;
	} | null>(null);
	const [prevOrder, setPrevOrder] = useState<string[]>([]);
	const [burst, setBurst] = useState<Burst | null>(null);
	const [typingText, setTypingText] = useState<string | null>(null);
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const burstIdRef = useRef(0);

	useEffect(() => {
		const supabase = createClient();

		const loadTeams = async () => {
			const req = await fetch("/api/teams");
			const { teams } = await req.json();
			if (teams) {
				setTeams(teams as Team[]);
			}
			setLoading(false);
		};

		loadTeams();

		const channel = supabase
			.channel("teams-live")
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "teams" },
				(payload) => {
					const updated = payload.new as Team;
					setTeams((prev) => {
						const existing = prev.find((t) => t.id === updated.id);
						if (!existing) return prev;

						const pointsGained = updated.score - existing.score;
						if (pointsGained <= 0) {
							return prev.map((t) => (t.id === updated.id ? updated : t));
						}

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
				},
			)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "teams" },
				(payload) => {
					const newTeam = payload.new as Team;
					setTeams((prev) => [...prev, newTeam]);
				},
			)
			.subscribe();

		const typingChannel = supabase
			.channel(TYPING_CHANNEL)
			.on("broadcast", { event: "typing" }, () => {
				setTypingText(getRandomTypingText());
				if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
				typingTimeoutRef.current = setTimeout(() => {
					setTypingText(null);
				}, 3500);
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
			supabase.removeChannel(typingChannel);
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		};
	}, []);

	const sorted = [...teams].sort((a, b) => b.score - a.score);
	const sortedIds = sorted.map((t) => t.id);

	useEffect(() => {
		if (teams.length > 0) {
			setPrevOrder(sortedIds);
		}
	}, [teams]);

	const rankChanges = new Map<string, "up" | "down" | "same">();
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

	if (loading) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<>
			<Confetti burst={burst} />
			<ScoreFlash burst={burst} />
			<ScoreAnnouncement burst={burst} />
			<TerminalOutput visible={true} />

			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "10rem",
					padding: "2rem 1rem",
					position: "relative",
				}}
			>
				{/* BLUE TEAM */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					style={{
						width: "100%",
						maxWidth: 560,
						border: "1px solid #1890ff22",
						borderRadius: 12,
						background: "linear-gradient(180deg, #0D0E14 0%, #0A0B0F 100%)",
						boxShadow: "0 0 30px #1890ff08, inset 0 0 30px #1890ff04",
						padding: "20px 20px 16px",
					}}
				>
					<ScoreboardHeader category="Blue" lastEvent={lastEvent} />

					{blueTeams.length === 0 && (
						<Text
							type="secondary"
							style={{
								display: "block",
								textAlign: "center",
								padding: 32,
								fontFamily: "monospace",
							}}
						>
							No blue teams yet
						</Text>
					)}

					{blueTeams.map((team, index) => (
						<LeaderboardRow
							key={team.id}
							team={team}
							index={index}
							isScoring={scoringTeamId === team.id}
							lastPoints={lastPoints}
							rankChange={rankChanges.get(team.id)}
							topScore={topScore}
							teamColor="#1890ff"
						/>
					))}

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						style={{
							textAlign: "center",
							marginTop: 32,
							padding: "16px 0",
							borderTop: "1px solid rgba(255,255,255,0.06)",
						}}
					>
						<Text
							style={{
								color: "rgba(255,255,255,0.3)",
								fontFamily: "monospace",
								fontSize: 12,
							}}
						>
							Total: {blueTeams.reduce((s, t) => s + t.score, 0).toLocaleString()}{" "}
							pts | Leader:{" "}
							<span style={{ color: "#1890ff" }}>
								{blueTeams[0]?.name}
							</span>
						</Text>
					</motion.div>
				</motion.div>

				{/* RED TEAM */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
					style={{
						width: "100%",
						maxWidth: 560,
						border: "1px solid #F8372D22",
						borderRadius: 12,
						background: "linear-gradient(180deg, #0D0E14 0%, #0A0B0F 100%)",
						boxShadow: "0 0 30px #F8372D08, inset 0 0 30px #F8372D04",
						padding: "20px 20px 16px",
					}}
				>
					<ScoreboardHeader category="Red" lastEvent={lastEvent} />

					{redTeams.length === 0 && (
						<Text
							type="secondary"
							style={{
								display: "block",
								textAlign: "center",
								padding: 32,
								fontFamily: "monospace",
							}}
						>
							No red teams yet
						</Text>
					)}

					{redTeams.map((team, index) => (
						<LeaderboardRow
							key={team.id}
							team={team}
							index={index}
							isScoring={scoringTeamId === team.id}
							lastPoints={lastPoints}
							rankChange={rankChanges.get(team.id)}
							topScore={topScore}
							teamColor="#F8372D"
						/>
					))}

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						style={{
							textAlign: "center",
							marginTop: 32,
							padding: "16px 0",
							borderTop: "1px solid rgba(255,255,255,0.06)",
						}}
					>
						<Text
							style={{
								color: "rgba(255,255,255,0.3)",
								fontFamily: "monospace",
								fontSize: 12,
							}}
						>
							Total: {redTeams.reduce((s, t) => s + t.score, 0).toLocaleString()}{" "}
							pts | Leader:{" "}
							<span style={{ color: "#F8372D" }}>
								{redTeams[0]?.name}
							</span>
						</Text>
					</motion.div>
				</motion.div>
			</div>
		</>
	);
}
