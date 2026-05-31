import type { ThemeConfig } from "antd";

export type ThemeMode = "dark" | "light";

const brandTokens = {
  red: "#F8372D",
  teal: "#2ABFAA",
  error: "#EF4444",
} as const;

const darkPalette = {
  ink: "#0A0B0F",
  paper: "#F0EDE6",
  red: brandTokens.red,
  teal: brandTokens.teal,
  redDim: "rgba(248,55,45,0.12)",
  redMid: "rgba(248,55,45,0.35)",
  muted: "rgba(240,237,230,0.45)",
  border: "rgba(255,255,255,0.1)",
  cardBg: "rgba(255,255,255,0.04)",
  containerBg: "#1A1A1D",
  layoutBg: "#0A0B0F",
  textSecondary: "rgba(240,237,230,0.6)",
  inputBg: "rgba(255,255,255,0.08)",
  successBg: "rgba(42,191,170,0.16)",
  successBorder: "rgba(42,191,170,0.45)",
  successText: "#7BE3D4",
  warningBg: "rgba(248,55,45,0.16)",
  warningBorder: "rgba(248,55,45,0.45)",
  warningText: "#FCA5A5",
  errorBg: "rgba(239,68,68,0.14)",
  errorBorder: "rgba(239,68,68,0.42)",
  errorText: "#FCA5A5",
} as const;

const lightPalette = {
  ink: "#F6F2E9",
  paper: "#1A1D24",
  red: brandTokens.red,
  teal: brandTokens.teal,
  redDim: "rgba(248,55,45,0.2)",
  redMid: "rgba(248,55,45,0.36)",
  muted: "rgba(26,29,36,0.45)",
  border: "rgba(26,29,36,0.16)",
  cardBg: "#FFFFFF",
  containerBg: "#FFFFFF",
  layoutBg: "#F6F2E9",
  textSecondary: "rgba(26,29,36,0.65)",
  inputBg: "rgba(26,29,36,0.06)",
  successBg: "rgba(42,191,170,0.14)",
  successBorder: "rgba(42,191,170,0.4)",
  successText: "#0F766E",
  warningBg: "rgba(248,55,45,0.18)",
  warningBorder: "rgba(248,55,45,0.42)",
  warningText: "#B91C1C",
  errorBg: "rgba(239,68,68,0.14)",
  errorBorder: "rgba(239,68,68,0.38)",
  errorText: "#B91C1C",
} as const;

export const designTokens = {
  ...darkPalette,
  error: brandTokens.error,
} as const;

const resolvePalette = (mode: ThemeMode) => {
  return mode === "light" ? lightPalette : darkPalette;
};

export const getAntdTheme = (mode: ThemeMode): ThemeConfig => {
  const palette = resolvePalette(mode);

  return {
    token: {
      colorPrimary: palette.red,
      colorInfo: palette.red,
      colorSuccess: palette.teal,
      colorWarning: palette.red,
      colorError: brandTokens.error,

      colorInfoBg: palette.warningBg,
      colorInfoBorder: palette.warningBorder,
      colorInfoText: palette.warningText,
      colorSuccessBg: palette.successBg,
      colorSuccessBorder: palette.successBorder,
      colorSuccessText: palette.successText,
      colorWarningBg: palette.warningBg,
      colorWarningBorder: palette.warningBorder,
      colorWarningText: palette.warningText,
      colorErrorBg: palette.errorBg,
      colorErrorBorder: palette.errorBorder,
      colorErrorText: palette.errorText,

      colorBgBase: palette.layoutBg,
      colorTextBase: palette.paper,

      colorBgLayout: palette.layoutBg,
      colorBgContainer: palette.containerBg,
      colorBgElevated: palette.containerBg,
      colorBorder: palette.border,

      colorText: palette.paper,
      colorTextSecondary: palette.textSecondary,
      colorTextPlaceholder: palette.muted,

      controlOutline: palette.redMid,
      colorPrimaryBg: palette.redDim,
      colorFillAlter: palette.cardBg,

      borderRadius: 12,
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    },
    components: {
      Layout: {
        bodyBg: palette.layoutBg,
        headerBg: palette.containerBg,
        siderBg: mode === "light" ? "#ECE6D8" : "#1A1A1D",
        footerBg: palette.layoutBg,
      },
      Card: {
        colorBgContainer: palette.cardBg,
        colorBorderSecondary: palette.border,
      },
      Button: {
        primaryShadow: "0 0 0 0 transparent",
        defaultBorderColor: palette.border,
        defaultColor: palette.paper,
        defaultBg: palette.containerBg,
      },
      Input: {
        colorBgContainer: palette.inputBg,
        colorBorder: palette.border,
        colorTextPlaceholder: palette.muted,
        activeBorderColor: palette.red,
        hoverBorderColor: palette.red,
      },
      Table: {
        headerBg: "rgba(255,255,255,0.03)",
        headerColor: "rgba(240,237,230,0.65)",
        rowHoverBg: "rgba(255,255,255,0.05)",
        borderColor: palette.border,
        colorBgContainer: "transparent",
      },
      Modal: {
        contentBg: "#1A1A1D",
        headerBg: "#1A1A1D",
        titleColor: palette.paper,
      },
    },
  };
};

export const antdTheme: ThemeConfig = getAntdTheme("dark");
