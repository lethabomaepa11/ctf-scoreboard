"use client";

import { useState, useEffect, useRef } from "react";
import {
	Card,
	Button,
	Select,
	InputNumber,
	Typography,
	App,
	Space,
	Divider,
	Tag,
} from "antd";
import { StarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TYPING_CHANNEL } from "@/utils/realtime-typing";
import type { Team } from "@/utils/constants";

const { Title, Text } = Typography;

export default function GradeTeamPage() {
	const [teams, setTeams] = useState<Team[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
	const [searchValue, setSearchValue] = useState("");
	const [gradePoints, setGradePoints] = useState(100);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { message } = App.useApp();
	const supabase = useRef(createClient());

	useEffect(() => {
		loadTeams();
	}, []);

	const loadTeams = async () => {
		const { data } = await supabase.current
			.from("teams")
			.select("*")
			.order("name");
		if (data) setTeams(data as Team[]);
	};

	const handleGrade = async () => {
		if (!selectedTeam) return;
		setLoading(true);
		try {
			const res = await fetch("/api/teams", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: selectedTeam, score: gradePoints }),
			});

			const { error } = await res.json();
			console.log("Grade response:", { res, error });
			if (error) {
				if (
					error.message.includes("function") &&
					error.message.includes("not found")
				) {
					const team = teams.find((t) => t.id === selectedTeam);
					if (team) {
						const { error: updateError } = await supabase.current
							.from("teams")
							.update({ score: team.score + gradePoints })
							.eq("id", selectedTeam);
						if (updateError) throw updateError;
					}
				} else {
					throw error;
				}
			}

			const teamName = teams.find((t) => t.id === selectedTeam)?.name;
			message.success(`${teamName} scored +${gradePoints}`);
			setGradePoints(100);
			loadTeams();
		} catch (err) {
			message.error(
				err instanceof Error ? err.message : "Failed to grade team",
			);
		} finally {
			setLoading(false);
		}
	};

	const typingChannelRef = useRef<ReturnType<
		typeof supabase.current.channel
	> | null>(null);

	useEffect(() => {
		const channel = supabase.current.channel(TYPING_CHANNEL);
		channel.subscribe();
		typingChannelRef.current = channel;
		return () => {
			channel.unsubscribe();
		};
	}, []);

	useEffect(() => {
		const channel = typingChannelRef.current;
		if (!channel) return;
		if (searchValue) {
			channel.send({ type: "broadcast", event: "typing", payload: {} });
		}
	}, [searchValue]);

	const filteredTeams = teams.filter((t) =>
		t.name.toLowerCase().includes(searchValue.toLowerCase()),
	);

	return (
		<div style={{ maxWidth: 560, margin: "0 auto" }}>
			<Button
				type="text"
				icon={<ArrowLeftOutlined />}
				onClick={() => router.push("/dashboard")}
				style={{ marginBottom: 16 }}
			>
				Back
			</Button>
			<Card
				title={
					<Space>
						<StarOutlined />
						<span>Grade Team</span>
					</Space>
				}
			>
				<Space direction="vertical" size="middle" style={{ width: "100%" }}>
					<div>
						<Text
							type="secondary"
							style={{ display: "block", marginBottom: 8 }}
						>
							Search and select a team
						</Text>
						<Select
							showSearch
							style={{ width: "100%" }}
							placeholder="Type to search teams..."
							value={selectedTeam}
							onSearch={setSearchValue}
							onChange={setSelectedTeam}
							filterOption={false}
							options={filteredTeams.map((t) => ({
								label: (
									<Space>
										<span>{t.name}</span>
										<Tag color={t.designation === "red" ? "red" : "blue"}>
											{t.designation}
										</Tag>
										<Text type="secondary">{t.score} pts</Text>
									</Space>
								),
								value: t.id,
							}))}
							notFoundContent={
								searchValue ? "No teams found" : "Start typing to search"
							}
						/>
					</div>

					{selectedTeam && (
						<>
							<Divider style={{ margin: "4px 0" }} />
							<div>
								<Text
									type="secondary"
									style={{ display: "block", marginBottom: 8 }}
								>
									Points to add
								</Text>
								<Space>
									{[50, 100, 200, 500, 1000].map((p) => (
										<Button
											key={p}
											size="small"
											type={gradePoints === p ? "primary" : "default"}
											onClick={() => setGradePoints(p)}
										>
											+{p}
										</Button>
									))}
									<InputNumber
										style={{ width: 100 }}
										min={1}
										value={gradePoints}
										onChange={(v) => setGradePoints(v || 0)}
									/>
								</Space>
							</div>
							<Button
								type="primary"
								size="large"
								loading={loading}
								onClick={handleGrade}
								block
							>
								Award Points
							</Button>
						</>
					)}
				</Space>
			</Card>
		</div>
	);
}
