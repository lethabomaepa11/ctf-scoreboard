"use client";

import { motion } from "framer-motion";
import { Typography } from "antd";
import { TrendingUp, TrendingDown, Crown } from "lucide-react";
import type { Team } from "@/utils/constants";
import { useStyles } from "./LeaderboardRow.style";

const { Text } = Typography;

export default function LeaderboardRow({
	team,
	index,
	isScoring,
	lastPoints,
	rankChange,
	topScore,
	teamColor,
}: {
	team: Team;
	index: number;
	isScoring: boolean;
	lastPoints: number;
	rankChange: "up" | "down" | "same" | undefined;
	topScore: number;
	teamColor: string;
	}) {
	const { styles } = useStyles();
	const barPercent = (team.score / topScore) * 100;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				layout: { type: "spring", stiffness: 180, damping: 24 },
			}}
			className={styles.row}
		>
			<motion.div
				animate={{
					width: `${barPercent}%`,
					backgroundColor: `${teamColor}18`,
				}}
				transition={{ duration: 0.6, ease: "easeOut" }}
				style={{
					position: "absolute",
					inset: 0,
					borderRadius: 10,
				}}
			/>

			<motion.div
				animate={
					isScoring
						? {
								scale: [1, 1.04, 1],
								boxShadow: [
									"0 0 0 transparent",
									`0 0 40px ${teamColor}66`,
									"0 0 0 transparent",
								],
							}
						: { scale: 1, boxShadow: "0 0 0 transparent" }
				}
				transition={{
					duration: 1.2,
					ease: "easeOut",
					times: [0, 0.3, 1],
				}}
				style={{
					display: "flex",
					alignItems: "center",
					padding: "14px 20px",
					borderRadius: 10,
					border: "1px solid",
					borderColor: isScoring
						? `${teamColor}88`
						: "rgba(255, 255, 255, 0.06)",
					backgroundColor: isScoring
						? `${teamColor}18`
						: "rgba(255, 255, 255, 0.03)",
					transition: "background-color 0.3s, border-color 0.3s",
				}}
			>
				<div className={styles.leftSection}>
					{index === 0 && (
						<Crown size={16} color="#ffd700" style={{ flexShrink: 0 }} />
					)}
					<motion.div
						animate={{
							boxShadow: isScoring
								? `0 0 24px ${teamColor}, 0 0 60px ${teamColor}44`
								: "0 0 0 transparent",
						}}
						transition={{ duration: 0.3 }}
						style={{
							width: 10,
							height: 10,
							borderRadius: "50%",
							backgroundColor: teamColor,
							flexShrink: 0,
						}}
					/>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<motion.span
							animate={{
								color: isScoring
									? teamColor
									: "rgba(255,255,255,0.9)",
							}}
							transition={{ duration: 0.3 }}
							className={styles.name}
						>
							{team.name}
						</motion.span>
						{rankChange === "up" && (
							<motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
								<TrendingUp size={14} color="#52c41a" />
							</motion.div>
						)}
						{rankChange === "down" && (
							<motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
								<TrendingDown size={14} color="#ff4d4f" />
							</motion.div>
						)}
					</div>
				</div>

				<div style={{ position: "relative", textAlign: "right" }}>
					<motion.span
						key={team.score}
						initial={
							isScoring
								? { scale: 1.6, color: "#52c41a" }
								: undefined
						}
						animate={{ scale: 1, color: "#fff" }}
						transition={{
							type: "spring",
							stiffness: 350,
							damping: 10,
						}}
						className={styles.score}
					>
						{team.score.toLocaleString()}
					</motion.span>
					<Text className={styles.scoreLabel}>
						pts
					</Text>

					{isScoring && (
						<motion.div
							initial={{ opacity: 1, y: 0, x: 0 }}
							animate={{ opacity: 0, y: -32, x: 8 }}
							transition={{ duration: 1.8, ease: "easeOut" }}
							className={styles.pointsPopup}
						>
							+{lastPoints}
						</motion.div>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}
