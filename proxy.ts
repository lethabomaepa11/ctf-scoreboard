import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
	const { supabase, response } = createClient(request);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
	const isLogin = request.nextUrl.pathname === "/dashboard/login";
	const isStatic =
		request.nextUrl.pathname.startsWith("/_next") ||
		request.nextUrl.pathname.startsWith("/favicon");

	if (isStatic) {
		return NextResponse.next();
	}

	if (isDashboard && !isLogin && !user) {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard/login";
		url.searchParams.set("from", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	if (isLogin && user) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return response;
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
