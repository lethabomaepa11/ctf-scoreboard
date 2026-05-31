"use client";

import { useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame } from "lucide-react";
import type { Burst } from "@/utils/constants";

const { Text } = Typography;

export function ScoreFlash({ burst }: { burst: Burst | null }) {
	return (
		<AnimatePresence>
			{burst && (
				<motion.div
					key={`flash-${burst.id}`}
					initial={{ opacity: 0.35 }}
					animate={{ opacity: 0 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					style={{
						position: "fixed",
						inset: 0,
						backgroundColor: burst.teamColor,
						pointerEvents: "none",
						zIndex: 9998,
					}}
				/>
			)}
		</AnimatePresence>
	);
}

export default function ScoreAnnouncement({
	burst,
}: { burst: Burst | null }) {
	const prevTeamRef = useRef<string | null>(null);
	const [streak, setStreak] = useState(0);

	useEffect(() => {
		if (!burst) return;
		if (prevTeamRef.current === burst.teamName) {
			setStreak((s) => Math.min(s + 1, 3));
		} else {
			setStreak(0);
		}
		prevTeamRef.current = burst.teamName;
	}, [burst]);

	return (
		<AnimatePresence>
			{burst && (
				<motion.div
					key={burst.id}
					initial={{ opacity: 0, y: -80, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -40, scale: 0.9 }}
					transition={{ type: "spring", stiffness: 250, damping: 18 }}
					style={{
						position: "fixed",
						top: 24,
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 10000,
						pointerEvents: "none",
					}}
				>
					<div
						style={{
							background:
								"linear-gradient(135deg, rgba(20,20,30,0.95), rgba(10,12,20,0.95))",
							border: `1px solid ${burst.teamColor}66`,
							borderRadius: 16,
							padding: "20px 48px",
							textAlign: "center",
							boxShadow: `0 0 60px ${burst.teamColor}33, 0 0 120px ${burst.teamColor}11`,
							backdropFilter: "blur(12px)",
							overflow: "hidden",
						}}
					>
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: "100%" }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								height: 3,
								background: `linear-gradient(90deg, transparent, ${burst.teamColor}, transparent)`,
							}}
						/>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								marginBottom: 4,
							}}
						>
							{streak >= 2 ? (
								<>
									<Flame size={20} color="#ff6b35" fill="#ff6b35" />
									<Text
										style={{
											color: "#ff6b35",
											fontWeight: 700,
											fontSize: 14,
											letterSpacing: 3,
										}}
									>
										HOT STREAK! x{streak + 1}
									</Text>
									<Flame size={20} color="#ff6b35" fill="#ff6b35" />
								</>
							) : (
								<>
									<Zap size={18} color={burst.teamColor} />
									<Text
										style={{
											color: burst.teamColor,
											fontWeight: 700,
											fontSize: 13,
											letterSpacing: 4,
										}}
									>
										FLAG CAPTURED
									</Text>
									<Zap size={18} color={burst.teamColor} />
								</>
							)}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: 0.2,
								type: "spring",
								stiffness: 300,
								damping: 12,
							}}
						>
							<Text
								style={{
									color: "#fff",
									fontSize: 32,
									fontWeight: 800,
									letterSpacing: 2,
									display: "block",
									lineHeight: 1.3,
								}}
							>
								{burst.teamName}
							</Text>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.35 }}
						>
							<Text
								style={{
									color: burst.teamColor,
									fontSize: 24,
									fontWeight: 700,
								}}
							>
								+{burst.points} pts
							</Text>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
