"use client";

import { Spin } from "antd";
import Confetti from "@/components/Confetti";
import ScoreAnnouncement, { ScoreFlash } from "@/components/ScoreAnnouncement";
import TeamColumn from "@/components/TeamColumn";
import TerminalOutput from "@/components/animations/TerminalOutput";
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
