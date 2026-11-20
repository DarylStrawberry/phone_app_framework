/**
 * Soft switches for the app factory.
 * Set a flag to false to disable a capability without deleting its folder.
 * Deleting a feature still requires removing its route files. See AGENT_GUIDE.md.
 */
export const features = {
  auth: true,
  biometrics: true,
  settings: true,
  home: true,
} as const;

export type FeatureFlag = keyof typeof features;
