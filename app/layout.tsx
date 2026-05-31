import type { Metadata } from "next";
import { Geist, Geist_Mono, Saira_Condensed } from "next/font/google";
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

const sairaCondensed = Saira_Condensed({
	variable: "--font-saira-condensed",
	subsets: ["latin"],
	weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "CTF Scoreboard",
	description: "Live CTF competition scoreboard",
	icons: [
		{ rel: "icon", url: "/favicon.ico", sizes: "any" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${sairaCondensed.variable}`}>
			<body className="min-h-full flex flex-col">
				<AntdProvider>
					<SiteHeader />
					{children}
				</AntdProvider>
			</body>
		</html>
	);
}
