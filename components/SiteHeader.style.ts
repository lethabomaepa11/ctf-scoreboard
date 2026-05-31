import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	header: css`
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 24px;
		background: rgba(10,11,15,0.85);
		backdrop-filter: blur(8px);

		${responsive.mobile} {
			padding: 10px 12px;
		}
	`,
	logo: css`
		border-radius: 6px;
	`,
	logoutBtn: css`
		color: rgba(240,237,230,0.65);
	`,
}));
