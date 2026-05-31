"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Typography, Button, Space, Spin } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { createClient } from "@/utils/supabase/client";

const { Header, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [checking, setChecking] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const supabase = createClient();
		supabase.auth.getUser().then(({ data: { user } }) => {
			if (!user) {
				router.replace("/dashboard/login");
			} else {
				setChecking(false);
			}
		});
	}, [router]);

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/dashboard/login");
	};

	if (checking) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 24px",
				}}
			>
				<Text strong style={{ fontSize: 16, color: "#F0EDE6" }}>
					CTF Scoreboard Admin
				</Text>
				<Button
					type="text"
					icon={<LogoutOutlined />}
					onClick={handleLogout}
					style={{ color: "rgba(240,237,230,0.65)" }}
				>
					Logout
				</Button>
			</Header>
			<Content style={{ padding: 24 }}>{children}</Content>
		</Layout>
	);
}
