import { z } from "zod";

import { getJson, preferencesStorage, setJson } from "@/core/storage";

const MOCK_USERS_KEY = "mock.users";

const mockUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

const mockUserListSchema = z.array(mockUserSchema);

export type MockUser = z.infer<typeof mockUserSchema>;

const seedUsers: MockUser[] = [
  {
    id: "user_demo",
    name: "Demo User",
    email: "demo@appfactory.dev",
    password: "password123",
  },
];

/** Mock accounts only. Live mode never reads this store. */
export async function readMockUsers(): Promise<MockUser[]> {
  const stored = await getJson(preferencesStorage, MOCK_USERS_KEY, mockUserListSchema);
  if (!stored || stored.length === 0) {
    await setJson(preferencesStorage, MOCK_USERS_KEY, seedUsers);
    return seedUsers;
  }
  return stored;
}

export async function writeMockUsers(users: MockUser[]): Promise<void> {
  await setJson(preferencesStorage, MOCK_USERS_KEY, users);
}
