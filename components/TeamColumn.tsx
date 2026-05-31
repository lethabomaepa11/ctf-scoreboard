"use client";

import { Typography } from "antd";
import { motion } from "framer-motion";
import ScoreboardHeader from "@/components/ScoreboardHeader";
import LeaderboardRow from "@/components/LeaderboardRow";
import type { Team } from "@/utils/constants";
import { useStyles } from "./TeamColumn.style";

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
	const { styles } = useStyles({ accentColor });

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: category === "Red" ? 0.15 : 0 }}
			className={styles.column}
		>
			<ScoreboardHeader category={category} lastEvent={lastEvent} />

			{teams.length === 0 && (
				<Text className={styles.emptyText}>
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
				className={styles.footer}
			>
				<Text className={styles.footerText}>
					Total: {teams.reduce((s, t) => s + t.score, 0).toLocaleString()} pts | Leader:{" "}
					<span className={styles.leaderName}>{teams[0]?.name}</span>
				</Text>
			</motion.div>
		</motion.div>
	);
}
