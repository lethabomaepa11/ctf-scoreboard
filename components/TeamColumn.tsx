"use client";

import { Typography } from "antd";
import { motion } from "framer-motion";
import ScoreboardHeader from "@/components/ScoreboardHeader";
import LeaderboardRow from "@/components/LeaderboardRow";
import type { Team } from "@/utils/constants";

const { Text } = Typography;

interface Props {
	category: "Blue" | "Red";
	teams: Team[];
	accentColor: string;
	lastEvent: { name: string; points: number } | null;
	scoringTeamId: string | null;
	lastPoints: number;
	rankChanges: Map<string, "up" | "down" | "same">;
	topScore: number;
}

export default function TeamColumn({
	category,
	teams,
	accentColor,
	lastEvent,
	scoringTeamId,
	lastPoints,
	rankChanges,
	topScore,
}: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: category === "Red" ? 0.15 : 0 }}
			style={{
				width: "100%",
				maxWidth: 560,
				border: `1px solid ${accentColor}22`,
				borderRadius: 12,
				background: "linear-gradient(180deg, #0D0E14 0%, #0A0B0F 100%)",
				boxShadow: `0 0 30px ${accentColor}08, inset 0 0 30px ${accentColor}04`,
				padding: "20px 20px 16px",
			}}
		>
			<ScoreboardHeader category={category} lastEvent={lastEvent} />

			{teams.length === 0 && (
				<Text
					type="secondary"
					style={{
						display: "block",
						textAlign: "center",
						padding: 32,
						fontFamily: "monospace",
					}}
				>
					No {category.toLowerCase()} teams yet
				</Text>
			)}

			{teams.map((team, index) => (
				<LeaderboardRow
					key={team.id}
					team={team}
					index={index}
					isScoring={scoringTeamId === team.id}
					lastPoints={lastPoints}
					rankChange={rankChanges.get(team.id)}
					topScore={topScore}
					teamColor={accentColor}
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
					Total: {teams.reduce((s, t) => s + t.score, 0).toLocaleString()} pts | Leader:{" "}
					<span style={{ color: accentColor }}>{teams[0]?.name}</span>
				</Text>
			</motion.div>
		</motion.div>
	);
}
