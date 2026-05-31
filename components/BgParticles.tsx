"use client";

import { motion } from "framer-motion";

const BLUE = "#1890ff";
const RED = "#F8372D";

interface Props {
	blueScore: number;
	redScore: number;
}

export default function BgParticles({ blueScore, redScore }: Props) {
	const total = blueScore + redScore;
	const ratio = total > 0
		? Math.min(Math.max(blueScore / total, 0.25), 0.75)
		: 0.5;

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 0,
				overflow: "hidden",
				pointerEvents: "none",
			}}
		>
			<motion.div
				animate={{
					width: [
						`${20 + ratio * 60}%`,
						"85%",
						`${20 + ratio * 60}%`,
						"20%",
						`${20 + ratio * 60}%`,
					],
					x: [0, 4, 0, -4, 0],
					opacity: [0.25, 0.4, 0.25, 0.15, 0.25],
				}}
				transition={{
					duration: 14,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					background: `linear-gradient(90deg, ${BLUE}35 0%, ${BLUE}15 50%, transparent 100%)`,
					filter: "blur(60px)",
				}}
			/>
			<motion.div
				animate={{
					width: [
						`${20 + (1 - ratio) * 60}%`,
						"20%",
						`${20 + (1 - ratio) * 60}%`,
						"85%",
						`${20 + (1 - ratio) * 60}%`,
					],
					x: [0, -4, 0, 4, 0],
					opacity: [0.25, 0.15, 0.25, 0.4, 0.25],
				}}
				transition={{
					duration: 14,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				style={{
					position: "absolute",
					right: 0,
					top: 0,
					bottom: 0,
					background: `linear-gradient(270deg, ${RED}35 0%, ${RED}15 50%, transparent 100%)`,
					filter: "blur(60px)",
				}}
			/>
		</div>
	);
}
