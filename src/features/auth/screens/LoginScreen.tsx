import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { errorMessage } from "@/core/api";
import { env } from "@/core/config";
import { AppText, Button, Input, ScreenWrapper } from "@/core/theme";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { loginSchema, type LoginInput } from "@/features/auth/services/schemas";

export function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
    } catch (error) {
      setError("root", { message: errorMessage(error) });
    }
  });

  return (
    <ScreenWrapper contentContainerClassName="justify-center">
      <View className="gap-8">
        <View className="gap-2">
          <AppText className="text-sm uppercase tracking-widest text-muted">{env.EXPO_PUBLIC_APP_NAME}</AppText>
          <AppText className="text-3xl font-semibold">Sign in</AppText>
          <AppText className="text-muted">
            Mock mode accepts demo@appfactory.dev and password123.
          </AppText>
        </View>

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
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            )}
          />
          {errors.root?.message ? (
            <AppText className="text-sm text-danger">{errors.root.message}</AppText>
          ) : null}
          <Button label="Sign in" loading={isSubmitting} onPress={() => void onSubmit()} />
        </View>

        <View className="gap-3">
          <Link href="/(auth)/forgot-password">
            <AppText className="text-accent">Forgot password</AppText>
          </Link>
          <Link href="/(auth)/signup">
            <AppText>
              New here? <AppText className="text-accent">Create an account</AppText>
            </AppText>
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  );
}
