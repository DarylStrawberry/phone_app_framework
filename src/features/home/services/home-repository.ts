import { apiClient } from "@/core/api";

import "@/features/home/services/register-mocks";
import { homeOverviewSchema, type HomeOverview } from "@/features/home/services/register-mocks";

export async function getHomeOverview(): Promise<HomeOverview> {
  const payload = await apiClient.request<unknown>({
    method: "GET",
    path: "/home/overview",
    silent: true,
  });
  return homeOverviewSchema.parse(payload);
}
