import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const supabase = createClient(cookieStore);

		const { data, error } = await supabase
			.from("teams")
			.select("*")
			.order("score", { ascending: false });

		if (error) throw error;

		return NextResponse.json({ teams: data });
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Failed to fetch teams" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const cookieStore = await cookies();
		const supabase = createClient(cookieStore);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id, score } = await request.json();

		if (!id || score == null) {
			return NextResponse.json(
				{ error: "Team ID and score are required" },
				{ status: 400 },
			);
		}

		const { data, error } = await supabase
			.from("teams")
			.select()
			.eq("id", id);

		if(error) throw error;
		if (!data || data.length === 0) {
			return NextResponse.json({ error: "Team not found" }, { status: 404 });
		}

		const team = data[0];
		const newScore = team.score + score;

		const { error: updateError } = await supabase
			.from("teams")
			.update({ score: newScore })
			.eq("id", id);

		if (error) throw error;

		return NextResponse.json({ team: data });
	} catch (err) {
		console.error("Error updating team score:", err);
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : "Failed to update team",
			},
			{ status: 500 },
		);
	}
}
