import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_APP_NAME: z.string().min(1).default("App Factory"),
  EXPO_PUBLIC_API_URL: z.url().default("https://api.appfactory.local"),
  EXPO_PUBLIC_API_MODE: z.enum(["mock", "live"]).default("mock"),
});

export type AppEnv = z.infer<typeof envSchema>;

function blankToUndefined(value: string | undefined): string | undefined {
  if (value === undefined || value.trim() === "") {
    return undefined;
  }
  return value;
}

function readEnv(): AppEnv {
  const parsed = envSchema.safeParse({
    EXPO_PUBLIC_APP_NAME: blankToUndefined(process.env.EXPO_PUBLIC_APP_NAME),
    EXPO_PUBLIC_API_URL: blankToUndefined(process.env.EXPO_PUBLIC_API_URL),
    EXPO_PUBLIC_API_MODE: blankToUndefined(process.env.EXPO_PUBLIC_API_MODE),
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables.\n${details}`);
  }

  return parsed.data;
}

export const env = readEnv();
