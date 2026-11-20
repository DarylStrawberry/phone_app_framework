import { Redirect, Stack } from "expo-router";

import { useProtectedGate } from "@/features/auth";

export default function ProtectedLayout() {
  const gate = useProtectedGate();

  if (gate === "boot") {
    return null;
  }
  if (gate === "login") {
    return <Redirect href="/(auth)/login" />;
  }
  if (gate === "unlock") {
    return <Redirect href="/(auth)/unlock" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
