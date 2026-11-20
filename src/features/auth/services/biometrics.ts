import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

import { features } from "@/core/config";
import { preferencesStorage, storageKeys } from "@/core/storage";

export async function canUseBiometrics(): Promise<boolean> {
  if (!features.biometrics || Platform.OS === "web") {
    return false;
  }

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && enrolled;
  } catch {
    return false;
  }
}

export async function promptBiometricUnlock(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock your session",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}

export async function readBiometricEnabled(): Promise<boolean> {
  return (await preferencesStorage.getString(storageKeys.biometricEnabled)) === "1";
}

export async function writeBiometricEnabled(enabled: boolean): Promise<void> {
  await preferencesStorage.setString(storageKeys.biometricEnabled, enabled ? "1" : "0");
}
