import { vars } from "nativewind";

import { appTheme, type ThemeScheme } from "@/core/theme/app.theme";

/** Maps the active palette onto the CSS variables Tailwind utilities read. */
export function themeVars(scheme: ThemeScheme) {
  const colors = appTheme.colors[scheme];
  return vars({
    "--color-canvas": colors.canvas,
    "--color-surface": colors.surface,
    "--color-ink": colors.ink,
    "--color-muted": colors.muted,
    "--color-line": colors.line,
    "--color-accent": colors.accent,
    "--color-accent-ink": colors.accentInk,
    "--color-danger": colors.danger,
    "--color-success": colors.success,
  });
}
