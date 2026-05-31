export interface Team {
	id: string;
	name: string;
	designation: "red" | "blue";
	score: number;
}

export interface Burst {
	id: number;
	teamName: string;
	teamColor: string;
	points: number;
}

export const CONFETTI_COLORS = [
	"#ff4d4f",
	"#1890ff",
	"#52c41a",
	"#faad14",
	"#eb2f96",
	"#722ed1",
	"#13c2c2",
	"#fa8c16",
	"#ffd700",
	"#ff6b6b",
	"#51cf66",
	"#339af0",
	"#f06595",
	"#cc5de8",
	"#ff922b",
];
