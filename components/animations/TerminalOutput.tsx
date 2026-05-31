"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { TYPING_CHANNEL, getRandomTypingText } from "@/utils/realtime-typing";

const TYPING_SPEED = 30;
const HIDE_DELAY = 5000;

export default function TerminalOutput() {
	const [visible, setVisible] = useState(false);
	const [displayedLine, setDisplayedLine] = useState("");
	const [typingLine, setTypingLine] = useState("");
	const queueRef = useRef<{ text: string }[]>([]);
	const busyRef = useRef(false);
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const typeText = useCallback((text: string) => {
		queueRef.current.push({ text });
		if (busyRef.current) return;
		busyRef.current = true;

		const processQueue = () => {
			const next = queueRef.current.shift();
			if (!next) {
				busyRef.current = false;
				return;
			}

			setDisplayedLine("");
			let i = 0;
			setTypingLine(next.text);
			const t = setInterval(() => {
				i++;
				setTypingLine(next.text.slice(0, i));
				if (i >= next.text.length) {
					clearInterval(t);
					setDisplayedLine(next.text);
					setTypingLine("");
					setTimeout(processQueue, 200);
				}
			}, TYPING_SPEED);
		};

		processQueue();
	}, []);

	useEffect(() => {
		const supabase = createClient();
		const channel = supabase
			.channel(TYPING_CHANNEL)
			.on("broadcast", { event: "typing" }, (payload) => {
				const { team, points } = payload.payload ?? {};
				const text = team && points
					? `root@ctf:~$ ${team} scored +${points} pts`
					: `root@ctf:~$ ${getRandomTypingText()}`;

				setVisible(true);
				if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
				hideTimerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY);
				typeText(text);
			})
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		};
	}, [typeText]);

	if (!visible) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 16,
				left: 16,
				zIndex: 2,
				width: 380,
				overflow: "hidden",
				background: "rgba(10,11,15,0.88)",
				border: "1px solid rgba(0,255,65,0.15)",
				borderRadius: 8,
				padding: "8px 12px",
				fontFamily: "monospace",
				fontSize: 11,
				lineHeight: 1.6,
				pointerEvents: "none",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 4,
					paddingBottom: 4,
					borderBottom: "1px solid rgba(0,255,65,0.1)",
				}}
			>
				<span style={{ color: "rgba(0,255,65,0.6)", fontSize: 10 }}>
					TERMINAL — /dev/tty0
				</span>
				<span style={{ color: "rgba(0,255,65,0.4)", fontSize: 10 }}>
					LISTENING
				</span>
			</div>
			<div>
				{displayedLine && (
					<div style={{ color: "#00ff41", whiteSpace: "pre-wrap" }}>
						{displayedLine}
					</div>
				)}
				{typingLine && (
					<div style={{ color: "#00ff41" }}>
						{typingLine}
						<span
							style={{
								display: "inline-block",
								width: 6,
								height: 12,
								background: "#00ff41",
								marginLeft: 2,
								opacity: 0.8,
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
