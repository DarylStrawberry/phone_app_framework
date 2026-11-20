import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router";
import type { ReactNode } from "react";

import { useTheme } from "@/core/theme/theme-context";

export function NavigationTheme({ children }: { children: ReactNode }) {
  const { resolved, colors } = useTheme();
  const base = resolved === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.accent,
          background: colors.canvas,
          card: colors.surface,
          text: colors.ink,
          border: colors.line,
          notification: colors.danger,
        },
      }}
    >
      {children}
    </NavigationThemeProvider>
  );
}
