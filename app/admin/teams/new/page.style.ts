import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	wrapper: css`
		max-width: 480px;
		margin: 0 auto;
	`,
	backBtn: css`
		margin-bottom: 16px;
	`,
}));
