import { ActivityIndicator, Pressable, type PressableProps } from "react-native";

import { AppText } from "@/core/theme/components/Text";
import { cn } from "@/core/theme/cn";
import { useTheme } from "@/core/theme/theme-context";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

const containerClass: Record<ButtonVariant, string> = {
  primary: "bg-accent",
  secondary: "border border-line bg-surface",
  ghost: "bg-transparent",
};

const labelClass: Record<ButtonVariant, string> = {
  primary: "text-accent-ink",
  secondary: "text-ink",
  ghost: "text-ink",
};

export function Button({
  label,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
      disabled={isDisabled}
      className={cn(
        "min-h-12 flex-row items-center justify-center rounded-lg px-4",
        containerClass[variant],
        isDisabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.accentInk : colors.ink} />
      ) : (
        <AppText className={cn("text-base font-semibold", labelClass[variant])}>{label}</AppText>
      )}
    </Pressable>
  );
}
