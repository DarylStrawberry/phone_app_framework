import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type ScrollViewProps,
} from "react-native";
import { cssInterop } from "nativewind";
import { SafeAreaView, type Edges } from "react-native-safe-area-context";

import { cn } from "@/core/theme/cn";

cssInterop(SafeAreaView, { className: "style" });

type ScreenWrapperProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edges;
  className?: string;
  contentContainerClassName?: string;
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
};

export function ScreenWrapper({
  children,
  scroll = true,
  edges = ["top", "bottom"],
  className,
  contentContainerClassName,
  keyboardShouldPersistTaps = "handled",
}: ScreenWrapperProps) {
  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerClassName={cn("grow px-5 py-6", contentContainerClassName)}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={cn("flex-1 px-5 py-6", contentContainerClassName)}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} className={cn("flex-1 bg-canvas", className)}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
