export const FUNNY_TYPING_TEXTS = [
	"oh, someone is going up the scoreboard…",
	"someone's about to get a glow up…",
	"the admin is cooking…",
	"big points incoming…",
	"someone's getting a buff…",
	"the scoreboard is about to shake…",
	"plot twist loading…",
	"someone's getting FLAGGED…",
	"points incoming, brace yourselves…",
	"admin's making moves…",
	"chaos mode activated…",
	"someone's about to be OP…",
	"a wild point appears…",
	"incoming transmission…",
	"the admin has entered the chat…",
	"skill issue incoming…",
	"poggers in progress…",
	"someone's about to speedrun the leaderboard…",
	"hacker voice: i'm in…",
];

export function getRandomTypingText(): string {
	return FUNNY_TYPING_TEXTS[
		Math.floor(Math.random() * FUNNY_TYPING_TEXTS.length)
	];
}

export const TYPING_CHANNEL = "admin-typing";
