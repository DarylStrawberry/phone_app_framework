import { Redirect, Stack, useSegments } from "expo-router";

import { useGuestGate } from "@/features/auth";

export default function AuthLayout() {
  const segments = useSegments();
  const gate = useGuestGate(segments);

  if (gate === "boot") {
    return null;
  }
  if (gate === "app") {
    return <Redirect href="/(app)" />;
  }
  if (gate === "login") {
    return <Redirect href="/(auth)/login" />;
  }
  if (gate === "unlock") {
    return <Redirect href="/(auth)/unlock" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
