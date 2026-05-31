"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Form, Input, Button, Typography, App } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const { Title, Text } = Typography;

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { message } = App.useApp();

	const handleLogin = async (values: { email: string; password: string }) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const { error } = await supabase.auth.signInWithPassword({
				email: values.email,
				password: values.password,
			});
			if (error) throw error;
			router.push("/dashboard");
		} catch (err) {
			message.error(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 24,
			}}
		>
			<Card
				style={{ width: "100%", maxWidth: 400 }}
				styles={{
					body: { padding: 32 },
				}}
			>
				<Title
					level={3}
					style={{ textAlign: "center", marginBottom: 8 }}
				></Title>
				<Text
					type="secondary"
					style={{
						display: "block",
						textAlign: "center",
						marginBottom: 32,
					}}
				>
					Sign in to manage the scoreboard
				</Text>

				<Form layout="vertical" onFinish={handleLogin} autoComplete="off">
					<Form.Item
						name="email"
						rules={[{ required: true, message: "Email is required" }]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" size="large" />
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: "Password is required" }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Password"
							size="large"
						/>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0 }}>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							block
							size="large"
						>
							Sign in
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
}
