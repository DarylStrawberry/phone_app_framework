import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { View } from "react-native";

import { env, features } from "@/core/config";
import { AppText, Card, ScreenWrapper } from "@/core/theme";
import { getHomeOverview } from "@/features/home/services/home-repository";

export function HomeScreen() {
  const overview = useQuery({
    queryKey: ["home", "overview"],
    queryFn: getHomeOverview,
    enabled: features.home,
  });

  return (
    <ScreenWrapper>
      <View className="gap-6">
        <View className="gap-2">
          <AppText className="text-sm uppercase tracking-widest text-muted">{env.EXPO_PUBLIC_APP_NAME}</AppText>
          <AppText className="text-3xl font-semibold">
            {overview.data?.greeting ?? "Home"}
          </AppText>
        </View>

        <Card className="gap-2">
          {overview.isPending ? <AppText className="text-muted">Loading overview…</AppText> : null}
          {overview.isError ? (
            <AppText className="text-danger">The overview could not be loaded.</AppText>
          ) : null}
          {overview.data ? <AppText>{overview.data.summary}</AppText> : null}
        </Card>

        {features.settings ? (
          <Link href="/(app)/settings">
            <AppText className="text-accent">Settings</AppText>
          </Link>
        ) : null}
      </View>
    </ScreenWrapper>
  );
}
