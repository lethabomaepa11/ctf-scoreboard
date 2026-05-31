"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useLogout } from "@/hooks/useLogout";
import { createClient } from "@/utils/supabase/client";
import { useStyles } from "./SiteHeader.style";

export default function SiteHeader() {
	const { styles } = useStyles();
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
		<div className={styles.header}>
			<Image
				src="/logo.png"
				alt="CTF Logo"
				width={200}
				height={36}
				priority
				className={styles.logo}
			/>
			{showLogout && (
				<Button
					type="text"
					icon={<LogoutOutlined />}
					onClick={logout}
					className={styles.logoutBtn}
				>
					Logout
				</Button>
			)}
		</div>
	);
}
