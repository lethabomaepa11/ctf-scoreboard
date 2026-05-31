"use client";

import { Typography, Button, Tag } from "antd";
import { motion } from "framer-motion";
import { RotateCcw, Zap } from "lucide-react";
import { useStyles } from "./ScoreboardHeader.style";

const { Title, Text } = Typography;

interface Event {
	name: string;
	points: number;
}

export default function ScoreboardHeader({
	category,
	lastEvent,
	onReset,
}: {
	category: "Blue" | "Red"
	lastEvent: Event | null;
	onReset?: () => void;
}) {
	const color = category === "Blue" ? "#1890ff" : "#F8372D";
	const { styles } = useStyles();

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className={styles.header}
			>
				<Title
					level={1}
					style={{
						margin: 0,
						letterSpacing: 6,
						fontSize: 28,
						color,
					}}
				>
					<motion.span
						animate={{ opacity: [1, 0.3, 1] }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className={styles.blink}
					>
						{">_"}
					</motion.span>{" "}
					{category} Team
				</Title>
				<Text
					type="secondary"
					style={{
						fontSize: 16,
						marginTop: 4,
						display: "block",
						color,
					}}
				>
					{category === "Blue" ? "THE DEFENDERS" : "THE PREDATORS"}
				</Text>
			</motion.div>

			<div className={styles.eventRow}>
				<motion.div
					layout
					className={styles.eventInner}
				>
					{lastEvent && (
						<motion.div
							key={`${lastEvent.name}-${lastEvent.points}`}
							initial={{ opacity: 0, x: -16, scale: 0.9 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, x: 16 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 20,
							}}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<Zap size={16} color="#52c41a" />
							<Tag bordered={false} color="success" style={{ margin: 0 }}>
								FLAG CAPTURED
							</Tag>
							<Text strong style={{ color: "#fff", fontSize: 14 }}>
								{lastEvent.name}
							</Text>
							<Text
								style={{
									color: "#52c41a",
									fontWeight: 700,
									fontSize: 14,
								}}
							>
								+{lastEvent.points}
							</Text>
						</motion.div>
					)}
				</motion.div>

				{onReset ? (
						<Button
							icon={<RotateCcw size={14} />}
							size="small"
							onClick={onReset}
							ghost
						>
							Reset
						</Button>
					) : null
				}
			</div>
		</>
	);
}
