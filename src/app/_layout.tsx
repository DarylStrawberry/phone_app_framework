import "react-native-gesture-handler";
import "../../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { AppProviders } from "@/core/providers";
import { NavigationTheme } from "@/core/theme";
import { useAuthStore } from "@/features/auth";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (status !== "booting") {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [status]);

  return (
    <AppProviders>
      <NavigationTheme>
        <Stack screenOptions={{ headerShown: false }} />
      </NavigationTheme>
    </AppProviders>
  );
}
