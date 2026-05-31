"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
	Card,
	Table,
	Typography,
	Button,
	Modal,
	InputNumber,
	Input,
	Tag,
	App,
	Divider,
	Space,
} from "antd";
import { TeamOutlined, StarOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, InputRef } from "antd";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TYPING_CHANNEL } from "@/utils/realtime-typing";
import type { Team } from "@/utils/constants";
import type { ColumnsType, FilterDropdownProps } from "antd/es/table/interface";
import { useStyles } from "./page.style";

const { Title, Text } = Typography;

export default function DashboardOverview() {
	const { styles } = useStyles();
	const router = useRouter();
	const { message } = App.useApp();

	const [teams, setTeams] = useState<Team[]>([]);
	const [gradeLoading, setGradeLoading] = useState(false);
	const [gradeTeam, setGradeTeam] = useState<Team | null>(null);
	const [gradePoints, setGradePoints] = useState(100);
	const [searchText, setSearchText] = useState("");
	const searchInput = useRef<InputRef>(null);

	const loadTeams = useCallback(async () => {
		const supabase = createClient();
		const req = await fetch("/api/teams");
		const { teams, error } = await req.json();

		if (teams) setTeams(teams as Team[]);
		if (error) message.error(error);
	}, []);

	useEffect(() => {
		loadTeams();
	}, [loadTeams]);

	const handleGrade = async () => {
		if (!gradeTeam) return;
		setGradeLoading(true);
		try {
			const res = await fetch("/api/teams", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: gradeTeam.id, score: gradePoints }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			message.success(`${gradeTeam.name} scored +${gradePoints}`);
			setGradeTeam(null);
			setGradePoints(100);
			loadTeams();

			const supabase = createClient();
			const channel = supabase.channel(TYPING_CHANNEL);
			channel.subscribe();
			channel.send({
				type: "broadcast",
				event: "typing",
				payload: { team: gradeTeam.name, points: gradePoints },
			});
			setTimeout(() => supabase.removeChannel(channel), 1000);
		} catch (err) {
			message.error(
				err instanceof Error ? err.message : "Failed to grade team",
			);
		} finally {
			setGradeLoading(false);
		}
	};

	const handleSearch = (
		selectedKeys: string[],
		confirm: FilterDropdownProps["confirm"],
	) => {
		confirm();
		setSearchText(selectedKeys[0] ?? "");
	};

	const handleReset = (
		clearFilters: () => void,
		confirm: FilterDropdownProps["confirm"],
	) => {
		clearFilters();
		setSearchText("");
		confirm();
	};

	const getColumnSearchProps = (
		dataIndex: keyof Team,
	): ColumnsType<Team>[number] => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder="Search team name"
					value={selectedKeys[0] as string}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						size="small"
						icon={<SearchOutlined />}
						onClick={() => handleSearch(selectedKeys as string[], confirm)}
					>
						Search
					</Button>
					<Button
						size="small"
						onClick={() => clearFilters && handleReset(clearFilters, confirm)}
					>
						Reset
					</Button>
					<Button type="link" size="small" onClick={() => close()}>
						Close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? "#F8372D" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				?.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()) ?? false,
		render: (text: string) => (
			<Space>
				<span>{text}</span>
			</Space>
		),
	});

	const columns: TableColumnsType<Team> = [
		{
			title: "Team",
			dataIndex: "name",
			key: "name",
			...getColumnSearchProps("name"),
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: "Designation",
			dataIndex: "designation",
			key: "designation",
			filters: [
				{ text: "Blue", value: "blue" },
				{ text: "Red", value: "red" },
			],
			onFilter: (value, record) => record.designation === value,
			render: (designation: string) => (
				<Tag color={designation === "red" ? "red" : "blue"}>{designation}</Tag>
			),
		},
		{
			title: "Score",
			dataIndex: "score",
			key: "score",
			sorter: (a, b) => a.score - b.score,
			defaultSortOrder: "descend",
			align: "center",
			render: (score: number) => (
				<Text strong className={styles.scoreCell}>
					{score.toLocaleString()}
				</Text>
			),
		},
		{
			title: "",
			key: "action",
			width: 100,
			render: (_: unknown, record: Team) => (
				<Button
					type="primary"
					size="small"
					icon={<StarOutlined />}
					onClick={() => {
						setGradeTeam(record);
						setGradePoints(100);
						const supabase = createClient();
						const channel = supabase.channel(TYPING_CHANNEL);
						channel.subscribe();
						channel.send({ type: "broadcast", event: "typing", payload: {} });
						setTimeout(() => supabase.removeChannel(channel), 1000);
					}}
				>
					Grade
				</Button>
			),
		},
	];

	return (
		<div className={styles.wrapper}>
			<Title level={3} className={styles.title}>
				Admin Dashboard
			</Title>
			<Text type="secondary" className={styles.subtitle}>
				Manage teams and scores
			</Text>

			<Divider style={{ borderColor: "rgba(255,255,255,0.06)" }} />

			<div
				style={{
					marginBottom: 16,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Title level={4} style={{ margin: 0 }}>
					Teams
				</Title>
				<Button
					type="primary"
					icon={<TeamOutlined />}
					onClick={() => router.push("/dashboard/teams/new")}
				>
					Add Team
				</Button>
			</div>

			<Input
				placeholder="Search teams by name..."
				prefix={<SearchOutlined />}
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				className={styles.searchInput}
				allowClear
			/>

			<Card styles={{ body: { padding: 0 } }}>
				<Table
					dataSource={teams.filter((t) =>
						t.name.toLowerCase().includes(searchText.toLowerCase()),
					)}
					columns={columns}
					rowKey="id"
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50"],
					}}
				/>
			</Card>

			<Modal
				title={
					<Space>
						<StarOutlined />
						<span>Grade: {gradeTeam?.name}</span>
					</Space>
				}
				open={!!gradeTeam}
				onCancel={() => setGradeTeam(null)}
				footer={null}
				width={400}
			>
				<Space
					direction="vertical"
					size="middle"
					style={{ width: "100%", marginTop: 16 }}
				>
					<div>
						<Text type="secondary" className={styles.pointsLabel}>
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

					{gradeTeam && (
						<div className={styles.gradePreview}>
							<Space>
								<Tag color={gradeTeam.designation === "red" ? "red" : "blue"}>
									{gradeTeam.designation}
								</Tag>
								<Text>Current: {gradeTeam.score.toLocaleString()} pts</Text>
								<Text type="secondary">→</Text>
								<Text
									strong
									style={{
										color: "#52c41a",
									}}
								>
									{(gradeTeam.score + gradePoints).toLocaleString()} pts
								</Text>
							</Space>
						</div>
					)}

					<Button
						type="primary"
						size="large"
						loading={gradeLoading}
						onClick={handleGrade}
						block
					>
						Award Points
					</Button>
				</Space>
			</Modal>
		</div>
	);
}
