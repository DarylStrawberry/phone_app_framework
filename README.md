# App Factory

Expo SDK 58 boilerplate for iOS and Android, in this repository. Routes stay thin, features stay removable, and brand colors live in one theme file.

The architecture contract is [AGENT_GUIDE.md](AGENT_GUIDE.md). Cursor also reads `.cursorrules`.

```bash
npm install
npm start
npm run typecheck
```

Copy `.env.example` to `.env` to point at a live API. The default mode is `mock`, so the login screen works offline.

Mock sign-in: `demo@appfactory.dev` / `password123`.

`react-native-mmkv` needs a development build. Expo Go keeps preferences in memory for that session and still stores the access token with `expo-secure-store`.
