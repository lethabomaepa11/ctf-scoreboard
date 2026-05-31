import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdProvider } from "@/utils/providers/AppProvider";
import SiteHeader from "@/components/SiteHeader";
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
	icons: [{ rel: "icon", url: "/logo.png" }],
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
					<SiteHeader />
					{children}
				</AntdProvider>
			</body>
		</html>
	);
}
