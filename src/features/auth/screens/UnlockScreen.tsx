import { useEffect, useState } from "react";
import { View } from "react-native";
import { Fingerprint } from "lucide-react-native";

import { AppText, Button, ScreenWrapper } from "@/core/theme";
import { useTheme } from "@/core/theme";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";

export function UnlockScreen() {
  const unlock = useAuthStore((state) => state.unlock);
  const logout = useAuthStore((state) => state.logout);
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setBusy(true);
    void unlock().then((success) => {
      if (!active) {
        return;
      }
      setFailed(!success);
      setBusy(false);
    });
    return () => {
      active = false;
    };
  }, [unlock]);

  return (
    <ScreenWrapper scroll={false} contentContainerClassName="justify-center">
      <View className="items-center gap-6">
        <Fingerprint color={colors.accent} size={42} />
        <View className="items-center gap-2">
          <AppText className="text-3xl font-semibold">Unlock</AppText>
          <AppText className="text-center text-muted">
            {failed
              ? "Biometric unlock was canceled. Try again, or sign in with your password."
              : "Confirm it is you to open your session."}
          </AppText>
        </View>
        <View className="w-full gap-3">
          <Button
            label="Try again"
            loading={busy}
            onPress={() => {
              setBusy(true);
              void unlock().then((success) => {
                setFailed(!success);
                setBusy(false);
              });
            }}
          />
          <Button
            label="Use password instead"
            variant="secondary"
            onPress={() => {
              void logout();
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
