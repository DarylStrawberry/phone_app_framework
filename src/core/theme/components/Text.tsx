import { Text, type TextProps } from "react-native";

import { cn } from "@/core/theme/cn";

export function AppText({ className, ...props }: TextProps) {
  return <Text className={cn("text-base text-ink", className)} {...props} />;
}
