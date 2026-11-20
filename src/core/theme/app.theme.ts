/**
 * White-label design tokens.
 *
 * Change this file to rebrand. Tailwind utility names stay the same
 * (`bg-canvas`, `text-ink`, `bg-accent`). Runtime colors are applied as CSS
 * variables from `themeVars`.
 */
export const appTheme = {
  metadata: {
    name: "App Factory",
    slug: "app-factory",
    scheme: "appfactory",
    version: "1.0.0",
    iosBundleId: "com.appfactory.app",
    androidPackage: "com.appfactory.app",
  },
  fonts: {
    sans: "System",
    mono: "monospace",
  },
  /** Pixel values. They match the default Tailwind spacing scale. */
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  colors: {
    light: {
      canvas: "#f3efe6",
      surface: "#fffdf8",
      ink: "#1c1915",
      muted: "#6f675e",
      line: "#e4dccf",
      accent: "#8d3b2c",
      accentInk: "#fffdf8",
      danger: "#9f1239",
      success: "#3f6212",
    },
    dark: {
      canvas: "#12110f",
      surface: "#1d1b18",
      ink: "#f3efe6",
      muted: "#b7aea3",
      line: "#3a342c",
      accent: "#e08a72",
      accentInk: "#1c1915",
      danger: "#fb7185",
      success: "#bef264",
    },
  },
} as const;

export type ThemeScheme = keyof typeof appTheme.colors;
export type ThemePreference = ThemeScheme | "system";
export type ThemeColors = {
  [Key in keyof (typeof appTheme.colors)["light"]]: string;
};
