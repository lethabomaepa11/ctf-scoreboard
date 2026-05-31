"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useLogout } from "@/hooks/useLogout";
import { createClient } from "@/utils/supabase/client";

export default function SiteHeader() {
	const { logout } = useLogout();
	const pathname = usePathname();
	const [showLogout, setShowLogout] = useState(false);

	useEffect(() => {
		if (pathname.startsWith("/dashboard")) {
			createClient()
				.auth.getUser()
				.then(({ data: { user } }) => setShowLogout(!!user));
		} else {
			setShowLogout(false);
		}
	}, [pathname]);

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "12px 24px",
				background: "rgba(10,11,15,0.85)",
				backdropFilter: "blur(8px)",
			}}
		>
			<Image
				src="/logo.png"
				alt="CTF Logo"
				width={200}
				height={36}
				priority
				style={{ borderRadius: 6 }}
			/>
			{showLogout && (
				<Button
					type="text"
					icon={<LogoutOutlined />}
					onClick={logout}
					style={{ color: "rgba(240,237,230,0.65)" }}
				>
					Logout
				</Button>
			)}
		</div>
	);
}
