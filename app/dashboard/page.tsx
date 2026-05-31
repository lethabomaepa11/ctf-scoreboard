"use client";

import { Card, Typography, Row, Col, Space } from "antd";
import { UserAddOutlined, TeamOutlined, StarOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const sections = [
	{
		key: "users",
		title: "Add User",
		description: "Create a new admin user account",
		icon: <UserAddOutlined style={{ fontSize: 32, color: "#F8372D" }} />,
		path: "/dashboard/users",
	},
	{
		key: "teams-new",
		title: "Add Team",
		description: "Register a new team to the scoreboard",
		icon: <TeamOutlined style={{ fontSize: 32, color: "#F8372D" }} />,
		path: "/dashboard/teams/new",
	},
	{
		key: "teams-grade",
		title: "Grade Team",
		description: "Search and award points to a team",
		icon: <StarOutlined style={{ fontSize: 32, color: "#F8372D" }} />,
		path: "/dashboard/teams/grade",
	},
];

export default function DashboardOverview() {
	const router = useRouter();

	return (
		<div style={{ maxWidth: 800, margin: "0 auto" }}>
			<Title level={3} style={{ marginBottom: 8 }}>
				Admin Dashboard
			</Title>
			<Text
				type="secondary"
				style={{
					display: "block",
					marginBottom: 32,
					fontFamily: "monospace",
				}}
			>
				Manage teams, users, and scores
			</Text>

			<Row gutter={[24, 24]}>
				{sections.map((s) => (
					<Col xs={24} sm={8} key={s.key}>
						<Card
							hoverable
							onClick={() => router.push(s.path)}
							style={{ textAlign: "center", cursor: "pointer", height: "100%" }}
							styles={{ body: { padding: 32 } }}
						>
							<Space direction="vertical" size="middle" style={{ display: "flex" }}>
								{s.icon}
								<Title level={4} style={{ margin: 0 }}>
									{s.title}
								</Title>
								<Text type="secondary">{s.description}</Text>
							</Space>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
}
