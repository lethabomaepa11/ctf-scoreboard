"use client";

import { Spin } from "antd";
import Confetti from "@/components/Confetti";
import ScoreAnnouncement, { ScoreFlash } from "@/components/ScoreAnnouncement";
import TeamColumn from "@/components/TeamColumn";
import TerminalOutput from "@/components/animations/TerminalOutput";
import BgParticles from "@/components/BgParticles";
import { useScoreboard } from "@/hooks/useScoreboard";
import { useStyles } from "./page.style";

export default function Home() {
	const { styles } = useStyles();
	const {
		loading,
		scoringTeamId,
		lastPoints,
		lastEvent,
		burst,
		rankChanges,
		topScore,
		blueTeams,
		redTeams,
	} = useScoreboard();

	if (loading) {
		return (
			<div className={styles.loading}>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<>
			<Confetti burst={burst} />
			<ScoreFlash burst={burst} />
			<ScoreAnnouncement burst={burst} />
			<TerminalOutput />
			<BgParticles blueScore={blueTeams.reduce((s, t) => s + t.score, 0)} redScore={redTeams.reduce((s, t) => s + t.score, 0)} />

			<div className={styles.container}>
				<TeamColumn
					category="Blue"
					teams={blueTeams}
					accentColor="#1890ff"
					lastEvent={lastEvent}
					scoringTeamId={scoringTeamId}
					lastPoints={lastPoints}
					rankChanges={rankChanges}
					topScore={topScore}
				/>

				<TeamColumn
					category="Red"
					teams={redTeams}
					accentColor="#F8372D"
					lastEvent={lastEvent}
					scoringTeamId={scoringTeamId}
					lastPoints={lastPoints}
					rankChanges={rankChanges}
					topScore={topScore}
				/>
			</div>
		</>
	);
}
