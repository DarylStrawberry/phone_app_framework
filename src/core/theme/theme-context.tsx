import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { View, useColorScheme as useSystemScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "nativewind";

import {
  appTheme,
  type ThemeColors,
  type ThemePreference,
  type ThemeScheme,
} from "@/core/theme/app.theme";
import { themeVars } from "@/core/theme/theme-vars";
import { preferencesStorage, storageKeys } from "@/core/storage";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ThemeScheme;
  colors: ThemeColors;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemScheme();
  const { setColorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    let active = true;
    void preferencesStorage.getString(storageKeys.theme).then((stored) => {
      if (!active || !isPreference(stored)) {
        return;
      }
      setPreferenceState(stored);
      setColorScheme(stored);
    });
    return () => {
      active = false;
    };
  }, [setColorScheme]);

  const resolved: ThemeScheme =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const colors: ThemeColors = appTheme.colors[resolved];

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.canvas);
  }, [colors.canvas]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      colors,
      setPreference: (next) => {
        setPreferenceState(next);
        setColorScheme(next);
        void preferencesStorage.setString(storageKeys.theme, next);
      },
    }),
    [colors, preference, resolved, setColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      <View style={themeVars(resolved)} className="flex-1 bg-canvas">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return value;
}
