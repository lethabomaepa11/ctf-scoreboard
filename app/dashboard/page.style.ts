import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	wrapper: css`
		max-width: 960px;
		margin: 0 auto;

		${responsive.mobile} {
			padding: 0 4px;
		}
	`,
	title: css`
		margin-bottom: 8px;
	`,
	subtitle: css`
		display: block;
		margin-bottom: 32px;
		font-family: monospace;
	`,
	searchInput: css`
		margin-bottom: 16px;
		max-width: 320px;

		${responsive.mobile} {
			max-width: 100%;
		}
	`,
	scoreCell: css`
		font-family: monospace;
		font-size: 16px;
		font-weight: 600;
	`,
	gradePreview: css`
		padding: 12px;
		background: rgba(255,255,255,0.03);
		border-radius: 8px;
	`,
	pointsLabel: css`
		display: block;
		margin-bottom: 8px;
	`,
}));
