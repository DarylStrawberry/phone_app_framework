import type { ExpoConfig } from "expo/config";

/**
 * Native config cannot import `app.theme.ts` (Expo loads this file as plain JS).
 * Keep the fallback name, bundle ids, and splash color aligned with
 * `src/core/theme/app.theme.ts`. The on-screen name still comes from
 * EXPO_PUBLIC_APP_NAME, which defaults to the same product name.
 */
const appName = process.env.EXPO_PUBLIC_APP_NAME?.trim() || "App Factory";
const splashColor = "#f3efe6";

const config: ExpoConfig = {
  name: appName,
  slug: "app-factory",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "appfactory",
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: "com.appfactory.app",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.appfactory.app",
    adaptiveIcon: {
      backgroundColor: splashColor,
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: splashColor,
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    ],
    [
      "expo-secure-store",
      {
        faceIDPermission: `Allow ${appName} to use Face ID to unlock your session.`,
      },
    ],
    [
      "expo-local-authentication",
      {
        faceIDPermission: `Allow ${appName} to use Face ID to unlock your session.`,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
