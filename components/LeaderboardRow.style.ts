import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	row: css`
		margin-bottom: 8px;
		position: relative;
	`,
	leftSection: css`
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12px;
	`,
	name: css`
		font-size: 15px;

		@media (max-width: 640px) {
			font-size: 13px;
		}
	`,
	score: css`
		font-size: 18px;
		font-weight: 700;
	`,
	scoreLabel: css`
		color: rgba(255,255,255,0.3);
		font-size: 12px;
		margin-left: 4px;
	`,
	pointsPopup: css`
		position: absolute;
		top: -24px;
		right: 0;
		color: #52c41a;
		font-weight: 700;
		font-size: 20px;
		pointer-events: none;
		text-shadow: 0 0 12px rgba(82,196,26,0.6);
	`,
}));
