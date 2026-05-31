"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Typography, App, Space } from "antd";
import { UserAddOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function AddUserPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { message } = App.useApp();

	const handleSubmit = async (values: { email: string; password: string }) => {
		setLoading(true);
		try {
			const res = await fetch("/api/admin/create-user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			message.success(`User ${values.email} created`);
		} catch (err) {
			message.error(
				err instanceof Error ? err.message : "Failed to create user",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: 480, margin: "0 auto" }}>
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
						<UserAddOutlined />
						<span>Add User</span>
					</Space>
				}
			>
				<Form layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						name="email"
						label="Email"
						rules={[{ required: true, type: "email" }]}
					>
						<Input placeholder="admin@example.com" />
					</Form.Item>
					<Form.Item
						name="password"
						label="Password"
						rules={[{ required: true, min: 6 }]}
					>
						<Input.Password placeholder="Min 6 characters" />
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }}>
						<Button type="primary" htmlType="submit" loading={loading} block>
							Create User
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
}
