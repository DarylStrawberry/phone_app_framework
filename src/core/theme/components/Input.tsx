import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { AppText } from "@/core/theme/components/Text";
import { cn } from "@/core/theme/cn";
import { useTheme } from "@/core/theme/theme-context";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, secureTextEntry, className, ...props }: InputProps) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const canReveal = Boolean(secureTextEntry);

  return (
    <View className="gap-2">
      <AppText className="text-sm font-medium">{label}</AppText>
      <View className="flex-row items-center rounded-lg border border-line bg-surface">
        <TextInput
          placeholderTextColor={colors.muted}
          secureTextEntry={canReveal ? hidden : false}
          className={cn("min-h-12 flex-1 px-3 text-base text-ink", className)}
          {...props}
        />
        {canReveal ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            onPress={() => setHidden((current) => !current)}
            className="px-3 py-3"
          >
            <AppText className="text-sm text-muted">{hidden ? "Show" : "Hide"}</AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? <AppText className="text-sm text-danger">{error}</AppText> : null}
    </View>
  );
}
