import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }, props: { accentColor: string }) => ({
	column: css`
		width: 100%;
		max-width: 560px;
		border: 1px solid ${props.accentColor}22;
		border-radius: 12px;
		background: linear-gradient(180deg, #0D0E14 0%, #0A0B0F 100%);
		box-shadow: 0 0 30px ${props.accentColor}08, inset 0 0 30px ${props.accentColor}04;
		padding: 20px 20px 16px;

		@media (max-width: 640px) {
			max-width: 100%;
			padding: 16px 14px 12px;
		}
	`,
	footer: css`
		text-align: center;
		margin-top: 32px;
		padding: 16px 0;
		border-top: 1px solid rgba(255,255,255,0.06);

		@media (max-width: 640px) {
			margin-top: 24px;
			padding: 12px 0;
		}
	`,
	footerText: css`
		color: rgba(255,255,255,0.3);
		font-size: 12px;
	`,
	leaderName: css`
		color: ${props.accentColor};
	`,
	emptyText: css`
		display: block;
		text-align: center;
		padding: 32px;
	`,
}));
