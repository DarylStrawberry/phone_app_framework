import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { errorMessage } from "@/core/api";
import { AppText, Button, Card, Input, ScreenWrapper } from "@/core/theme";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/services/schemas";

export function ForgotPasswordScreen() {
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const [notice, setNotice] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setNotice(await requestPasswordReset(values));
    } catch (error) {
      setNotice(null);
      setError("root", { message: errorMessage(error) });
    }
  });

  return (
    <ScreenWrapper contentContainerClassName="justify-center">
      <View className="gap-8">
        <View className="gap-2">
          <AppText className="text-3xl font-semibold">Reset password</AppText>
          <AppText className="text-muted">
            We will not say whether the email is registered.
          </AppText>
        </View>

        {notice ? (
          <Card>
            <AppText>{notice}</AppText>
          </Card>
        ) : (
          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
              )}
            />
            {errors.root?.message ? (
              <AppText className="text-sm text-danger">{errors.root.message}</AppText>
            ) : null}
            <Button label="Send reset link" loading={isSubmitting} onPress={() => void onSubmit()} />
          </View>
        )}

        <Link href="/(auth)/login">
          <AppText className="text-accent">Back to sign in</AppText>
        </Link>
      </View>
    </ScreenWrapper>
  );
}
