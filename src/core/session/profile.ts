import { z } from "zod";

export const sessionProfileSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  name: z.string().min(1),
});

export type SessionProfile = z.infer<typeof sessionProfileSchema>;
