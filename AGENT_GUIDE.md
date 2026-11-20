# Agent guide

This file is the architecture contract. Follow it when you add a screen, a feature, or a brand. Expo SDK rules in `AGENTS.md` still apply: read `package.json` for the SDK major, then use the matching docs at `https://docs.expo.dev/versions/v58.0.0/`.

## Commands

Run these from this repository root (`application_framework`).

```bash
npm start
npm run typecheck
npx expo-doctor
npx expo install <package>
```

The app was created with:

```bash
npx create-expo-app@latest app-factory --template default@sdk-58
npx expo install expo-secure-store expo-local-authentication react-native-mmkv react-native-nitro-modules react-native-svg nativewind@4.2.7 zustand @tanstack/react-query react-hook-form @hookform/resolvers zod lucide-react-native tailwindcss@3.4.17
```

Install Expo and React Native packages with `npx expo install`, not a bare `npm install`, so versions stay aligned with SDK 58.

`react-native-mmkv` is a native module. Expo Go does not ship it. Preferences fall back to memory in Expo Go. A development build (`npx expo run:ios`, `npx expo run:android`, or `eas build --profile development`) persists them. Access tokens use `expo-secure-store`, which works in Expo Go. On web, secure storage is a testing fallback and is not secure.

## Dependency flow

```text
src/app          route files. They render a feature screen and nothing else.
    |
    v
src/features     screens, forms, and repositories for one product area.
    |
    v
src/core         theme, storage, API client, session, config. No feature imports.
```

- `src/core` must not import from `src/features`.
- A feature must not import another feature. The route file composes them.
- Screens, components, and hooks must not call `fetch`, `axios`, Supabase, or Firebase. They call a repository in that feature. The repository calls `apiClient`.
- Removing a feature means deleting `src/features/<name>` and every route file that imports it. The other features and `src/core` keep compiling.

`src/app/(app)/settings.tsx` is the example of composition: it renders `SettingsScreen` and passes `AccountSection` from auth. Settings itself does not import auth.

## Folder map

```text
app.config.ts                 native name, ids, plugins. Expo cannot import the TS theme, so keep splash color and bundle ids aligned with app.theme.ts
src/core/theme/app.theme.ts   colors, spacing, radius, default product metadata
tailwind.config.js            semantic color names only. Hex values are not here.
global.css                    Tailwind entry
babel.config.js               NativeWind + Expo preset
metro.config.js               withNativeWind
.env.example                  EXPO_PUBLIC_APP_NAME, API URL, API mode
src/app/_layout.tsx           providers, splash, session hydrate
src/app/(auth)/               login, signup, forgot-password, unlock
src/app/(app)/                home, settings. Guarded when features.auth is on
src/core/theme/               tokens, ThemeProvider, Button, Input, Card, ScreenWrapper
src/core/api/                 client, mock registry, query client, ApiError
src/core/storage/             secureStorage + preferencesStorage
src/core/config/              env.ts, features.ts
src/core/session/             profile read by any feature
src/core/toast/               global error toasts
src/core/providers/           SafeArea, Query, Theme
src/features/auth/            reference feature
src/features/home/            query + repository example
src/features/settings/        theme toggle, version, account slot
```

Each feature uses this shape. Add a folder only when it has code.

```text
src/features/<name>/
  components/
  hooks/
  screens/
  services/
  types/
  index.ts          public exports only
```

## How to add a feature

1. Create `src/features/<name>` with a screen and, if it talks to a server, a repository.
2. Register mock handlers in `services/register-mocks.ts` and import that module from the repository. Keys look like `"GET /things"`.
3. Add a route file under `src/app` that only imports the screen from `@/features/<name>`.
4. If the feature should be optional, add a flag in `src/core/config/features.ts` and branch in the route file.

The screen asks the repository for data. The repository calls `apiClient.request`. In mock mode the client dispatches the registered handler and never hits the network. In live mode it sends JSON to `EXPO_PUBLIC_API_URL`, adds `Authorization: Bearer <token>` unless `auth: false`, and toasts on failure unless `silent: true`.

A 401 on an authenticated request clears the session through `setUnauthorizedHandler`. Login and signup pass `auth: false` and `silent: true` so a wrong password stays on the form.

Parse responses with Zod inside the repository. Do not trust `as SomeType` from the network.

## Auth blueprint

`useAuthStore` statuses: `booting`, `anonymous`, `locked`, `authenticated`.

- No token: anonymous. `(app)` redirects to `/(auth)/login`.
- Token plus biometric preference: locked. The unlock screen calls `expo-local-authentication`.
- Token and no biometric: authenticated.
- `features.auth === false` skips the guard.

Demo account in mock mode: `demo@appfactory.dev` / `password123`. Mock passwords are stored in preferences for offline UI testing. Do not reuse that store in live mode.

Live auth contract:

```json
POST /auth/login
POST /auth/signup
{ "accessToken": "string", "refreshToken": "string?", "user": { "id": "string", "email": "string", "name": "string" } }

POST /auth/forgot-password
{ "email": "string" }
-> { "message": "string" }

GET /home/overview
Authorization: Bearer <accessToken>
-> { "greeting": "string", "summary": "string" }
```

Signup body is `{ name, email, password }`. Confirm-password stays on the form.

## Theme

Edit colors, spacing, radius, and store metadata in `src/core/theme/app.theme.ts`. `ThemeProvider` publishes the active palette as CSS variables. Tailwind classes such as `bg-canvas`, `text-ink`, and `bg-accent` read those variables, so screens do not take a `dark:` class for brand colors.

`useTheme().setPreference("light" | "dark" | "system")` persists the choice in preferences. Use `useTheme().colors` when a component needs a raw string, such as a Lucide icon.

`ScreenWrapper` includes `SafeAreaView` and `KeyboardAvoidingView`.

## Environment

`src/core/config/env.ts` validates public Expo variables with Zod. Only `EXPO_PUBLIC_*` names are visible in the client. Empty values fall back to the schema defaults. An invalid value throws at startup.

```bash
EXPO_PUBLIC_APP_NAME=App Factory
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_API_MODE=mock
```

`mock` is the offline UI mode. `live` uses the real URL.

## Storage

- `secureStorage`: access tokens and refresh tokens. Keys may contain letters, numbers, `.`, `-`, and `_`.
- `preferencesStorage`: theme, biometric flag, and the cached profile. Backed by MMKV when the native module loads.
- `getJson` / `setJson`: parse with a Zod schema before the value enters a store.

Do not put tokens in MMKV.

## Checks before you finish

```bash
npm run typecheck
```

Run `npx expo-doctor` after dependency changes. Do not edit `ios/` or `android/` by hand. Change native behavior through `app.config.ts` plugins.
