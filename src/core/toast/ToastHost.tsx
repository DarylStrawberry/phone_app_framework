import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/core/theme/components/Text";
import { useToastStore } from "@/core/toast/toast-store";

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 z-50 px-5"
      style={{ top: insets.top + 12 }}
    >
      {toasts.map((toast) => (
        <Pressable
          key={toast.id}
          accessibilityRole="alert"
          onPress={() => dismiss(toast.id)}
          className="mb-2 rounded-lg border border-line bg-surface px-4 py-3"
        >
          <AppText className="text-sm">{toast.message}</AppText>
        </Pressable>
      ))}
    </View>
  );
}
