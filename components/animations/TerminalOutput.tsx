"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { TYPING_CHANNEL, getRandomTypingText } from "@/utils/realtime-typing";

const CLS_AFTER = 4;
const TYPING_SPEED = 30;

export default function TerminalOutput({ visible = true }: { visible?: boolean }) {
	const [lines, setLines] = useState<string[]>([
		"root@ctf:~$ systemctl start scoreboard",
	]);
	const [typingLine, setTypingLine] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const countRef = useRef(0);
	const queueRef = useRef<{ text: string; onDone?: () => void }[]>([]);
	const busyRef = useRef(false);

	const typeText = useCallback((text: string, onDone?: () => void) => {
		queueRef.current.push({ text, onDone });
		if (busyRef.current) return;
		busyRef.current = true;

		const processQueue = () => {
			const next = queueRef.current.shift();
			if (!next) {
				busyRef.current = false;
				return;
			}

			let i = 0;
			setTypingLine(next.text);
			const t = setInterval(() => {
				i++;
				setTypingLine(next.text.slice(0, i));
				if (i >= next.text.length) {
					clearInterval(t);
					setLines((prev) => [...prev, next.text]);
					setTypingLine("");
					next.onDone?.();
					setTimeout(processQueue, 200);
				}
			}, TYPING_SPEED);
		};

		processQueue();
	}, []);

	useEffect(() => {
		if (!visible) return;
		const supabase = createClient();
		const channel = supabase
			.channel(TYPING_CHANNEL)
			.on("broadcast", { event: "typing" }, () => {
				countRef.current += 1;
				if (countRef.current >= CLS_AFTER) {
					countRef.current = 0;
					typeText("root@ctf:~$ cls", () => {
						setTimeout(() => {
							setLines([]);
						}, 500);
					});
				} else {
					typeText(`root@ctf:~$ ${getRandomTypingText()}`);
				}
			})
			.subscribe();
		return () => { supabase.removeChannel(channel); };
	}, [visible, typeText]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [lines, typingLine]);

	if (!visible) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 16,
				left: 16,
				zIndex: 2,
				width: 380,
				maxHeight: 220,
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
			<div ref={scrollRef} style={{ overflowY: "auto", maxHeight: 170 }}>
				{lines.map((line, i) => (
					<div
						key={i}
						style={{
							color: line.startsWith("root@ctf") ? "#00ff41" : "rgba(0,255,65,0.6)",
							whiteSpace: "pre-wrap",
						}}
					>
						{line}
					</div>
				))}
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
