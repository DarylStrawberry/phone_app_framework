/** Keys shared across features. Feature-private keys stay inside that feature. */
export const storageKeys = {
  accessToken: "auth.accessToken",
  refreshToken: "auth.refreshToken",
  profile: "session.profile",
  theme: "prefs.theme",
  biometricEnabled: "prefs.biometric",
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
