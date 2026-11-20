import { z } from "zod";

import { registerMockHandlers } from "@/core/api";
import { sessionProfileSchema } from "@/core/session";
import { getJson, preferencesStorage, storageKeys } from "@/core/storage";

registerMockHandlers({
  "GET /home/overview": async () => {
    const profile = await getJson(preferencesStorage, storageKeys.profile, sessionProfileSchema);
    const name = profile?.name ?? "there";

    return {
      status: 200,
      body: {
        greeting: `Hello, ${name}`,
        summary: "This overview came from the mock API. Swap EXPO_PUBLIC_API_MODE to live when a backend is ready.",
      },
    };
  },
});

export const homeOverviewSchema = z.object({
  greeting: z.string(),
  summary: z.string(),
});

export type HomeOverview = z.infer<typeof homeOverviewSchema>;
