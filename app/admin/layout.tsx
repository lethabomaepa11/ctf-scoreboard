"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Spin } from "antd";
import { createClient } from "@/utils/supabase/client";

const { Content } = Layout;

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
				router.replace("/login");
			} else {
				setChecking(false);
			}
		});
	}, [router]);

	if (checking) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					paddingTop: 60,
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Content style={{ padding: "80px 24px 24px" }}>{children}</Content>
		</Layout>
	);
}
