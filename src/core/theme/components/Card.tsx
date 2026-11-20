import { View, type ViewProps } from "react-native";

import { cn } from "@/core/theme/cn";

export function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("rounded-xl border border-line bg-surface p-4", className)}
      {...props}
    />
  );
}
