import type { ReactNode } from "react";
import Constants from "expo-constants";
import { Pressable, View } from "react-native";

import { appTheme, type ThemePreference } from "@/core/theme/app.theme";
import { AppText, Card, ScreenWrapper, useTheme } from "@/core/theme";
import { cn } from "@/core/theme/cn";

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

type SettingsScreenProps = {
  account?: ReactNode;
};

export function SettingsScreen({ account }: SettingsScreenProps) {
  const { preference, setPreference } = useTheme();
  const version = Constants.expoConfig?.version ?? appTheme.metadata.version;

  return (
    <ScreenWrapper>
      <View className="gap-6">
        <View className="gap-2">
          <AppText className="text-3xl font-semibold">Settings</AppText>
          <AppText className="text-muted">Appearance is stored on this device.</AppText>
        </View>

        {account}

        <Card className="gap-4">
          <AppText className="text-sm uppercase tracking-widest text-muted">Appearance</AppText>
          <View className="flex-row gap-2">
            {themeOptions.map((option) => {
              const selected = preference === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setPreference(option.value)}
                  className={cn(
                    "flex-1 items-center rounded-lg border px-3 py-3",
                    selected ? "border-accent bg-accent" : "border-line bg-canvas",
                  )}
                >
                  <AppText className={cn("text-sm font-medium", selected && "text-accent-ink")}>
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card className="flex-row items-center justify-between">
          <AppText className="text-muted">Version</AppText>
          <AppText className="font-medium">{version}</AppText>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
