"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function useLogout() {
	const router = useRouter();

	const logout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
	};

	return { logout };
}
