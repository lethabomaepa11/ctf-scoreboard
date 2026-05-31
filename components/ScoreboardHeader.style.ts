import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	header: css`
		text-align: center;
		margin-bottom: 24px;
	`,
	blink: css`
		opacity: 1;
	`,
	eventRow: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		min-height: 32px;
	`,
	eventInner: css`
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
		min-height: 32px;
	`,
}));
