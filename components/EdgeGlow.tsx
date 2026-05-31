"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Burst } from "@/utils/constants";

export default function EdgeGlow({ burst }: { burst: Burst | null }) {
	return (
		<AnimatePresence>
			{burst && (
				<motion.div
					key={burst.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 0.8, 0.4, 0.6, 0] }}
					exit={{ opacity: 0 }}
					transition={{ duration: 2, ease: "easeOut" }}
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 1,
						pointerEvents: "none",
						boxShadow: [
							`inset 0 0 200px 60px ${burst.teamColor}aa`,
							`inset 0 0 80px 20px ${burst.teamColor}66`,
						].join(", "),
					}}
				/>
			)}
		</AnimatePresence>
	);
}
