import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters" },
				{ status: 400 },
			);
		}

		let adminClient;
		try {
			adminClient = createAdminClient();
		} catch {
			return NextResponse.json(
				{
					error:
						"SUPABASE_SERVICE_ROLE_KEY not configured. Add it to your .env file.",
				},
				{ status: 500 },
			);
		}

		const { data, error } = await adminClient.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
		});

		if (error) throw error;

		return NextResponse.json({ user: data.user });
	} catch (err) {
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : "Failed to create user",
			},
			{ status: 500 },
		);
	}
}
