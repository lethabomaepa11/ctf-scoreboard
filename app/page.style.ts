import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, responsive }) => ({
	container: css`
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rem;
		padding: 80px 1rem 2rem;
		position: relative;

		${responsive.mobile} {
			flex-direction: column;
			gap: 2rem;
			padding: 80px 0.75rem 2rem;
		}
	`,
	loading: css`
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	`,
}));
