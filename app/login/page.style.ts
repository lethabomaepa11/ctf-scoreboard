import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	container: css`
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	`,
	card: css`
		width: 100%;
		max-width: 400px;
	`,
	title: css`
		text-align: center;
		margin-bottom: 8px;
	`,
	subtitle: css`
		display: block;
		text-align: center;
		margin-bottom: 32px;
	`,
}));
