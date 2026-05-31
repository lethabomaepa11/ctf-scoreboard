"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Select, Typography, App, Space } from "antd";
import { TeamOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const { Title } = Typography;

export default function AddTeamPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { message } = App.useApp();
	const [form] = Form.useForm();

	const handleSubmit = async (values: {
		name: string;
		designation: "red" | "blue";
	}) => {
		setLoading(true);
		try {
			const supabase = createClient();
			const { error } = await supabase.from("teams").insert([
				{ name: values.name, designation: values.designation, score: 0 },
			]);
			if (error) throw error;
			message.success(`Team "${values.name}" created`);
			form.resetFields();
		} catch (err) {
			message.error(
				err instanceof Error ? err.message : "Failed to create team",
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
						<TeamOutlined />
						<span>Add Team</span>
					</Space>
				}
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						name="name"
						label="Team Name"
						rules={[{ required: true }]}
					>
						<Input placeholder="Team name" />
					</Form.Item>
					<Form.Item
						name="designation"
						label="Designation"
						rules={[{ required: true }]}
					>
						<Select
							placeholder="Select designation"
							options={[
								{ label: "Red", value: "red" },
								{ label: "Blue", value: "blue" },
							]}
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }}>
						<Button type="primary" htmlType="submit" loading={loading} block>
							Create Team
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
}
