export type ThemeId = "ember" | "aurora" | "cinema" | "gemini";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  fonts: { headline: string; body: string; mono: string; };
  colors: {
    background: string;
    surface: string;
    glassFill: string;
    glassBorder: string;
    glassBorderHover: string;
    glassBlur: string;       // e.g. "12px"
    accent: string;
    accentGlow: string;      // rgba for box-shadow
    textPrimary: string;
    textSecondary: string;
    textAccent: string;
    error: string;
  };
  geometry: { borderRadius: string; };
  animation: { duration: string; easing: string; };
}
