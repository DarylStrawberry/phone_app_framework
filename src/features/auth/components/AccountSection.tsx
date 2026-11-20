import { useState } from "react";
import { Switch, View } from "react-native";

import { features } from "@/core/config";
import { useSessionStore } from "@/core/session";
import { AppText, Button, Card } from "@/core/theme";
import { useTheme } from "@/core/theme";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";

export function AccountSection() {
  const profile = useSessionStore((state) => state.profile);
  const biometricEnabled = useAuthStore((state) => state.biometricEnabled);
  const biometricAvailable = useAuthStore((state) => state.biometricAvailable);
  const setBiometricEnabled = useAuthStore((state) => state.setBiometricEnabled);
  const logout = useAuthStore((state) => state.logout);
  const { colors } = useTheme();
  const [pending, setPending] = useState(false);

  return (
    <Card className="gap-4">
      <View className="gap-1">
        <AppText className="text-sm uppercase tracking-widest text-muted">Account</AppText>
        <AppText className="text-xl font-semibold">{profile?.name ?? "Not signed in"}</AppText>
        <AppText className="text-muted">{profile?.email ?? "No profile stored on this device."}</AppText>
      </View>

      {features.biometrics ? (
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-1">
            <AppText className="font-medium">Unlock with biometrics</AppText>
            <AppText className="text-sm text-muted">
              {biometricAvailable
                ? "Ask for Face ID or a fingerprint the next time a session is restored."
                : "This device has no enrolled biometrics."}
            </AppText>
          </View>
          <Switch
            accessibilityLabel="Unlock with biometrics"
            value={biometricEnabled}
            disabled={!biometricAvailable || pending}
            onValueChange={(next) => {
              setPending(true);
              void setBiometricEnabled(next).finally(() => setPending(false));
            }}
            trackColor={{ true: colors.accent, false: colors.line }}
            thumbColor={colors.surface}
          />
        </View>
      ) : null}

      <Button label="Sign out" variant="secondary" onPress={() => void logout()} />
    </Card>
  );
}
