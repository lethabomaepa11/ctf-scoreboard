import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdProvider } from "@/utils/providers/AppProvider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CTF Scoreboard",
	description: "Live CTF competition scoreboard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
			<body className="min-h-full flex flex-col">
				<AntdProvider>
					<div
						style={{
							position: "fixed",
							top: 16,
							left: 24,
							zIndex: 1000,
							display: "flex",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Image
							src="/logo.png"
							alt="CTF Logo"
							width={400}
							height={71}
							priority
							style={{ borderRadius: 6 }}
						/>
					</div>
					{children}
				</AntdProvider>
			</body>
		</html>
	);
}
