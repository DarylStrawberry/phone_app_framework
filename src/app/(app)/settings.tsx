import { Redirect } from "expo-router";

import { features } from "@/core/config";
import { AccountSection } from "@/features/auth";
import { SettingsScreen } from "@/features/settings";

export default function SettingsRoute() {
  if (!features.settings) {
    return <Redirect href="/(app)" />;
  }

  return <SettingsScreen account={features.auth ? <AccountSection /> : undefined} />;
}
