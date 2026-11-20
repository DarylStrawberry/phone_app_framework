import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { errorMessage } from "@/core/api";
import { AppText, Button, Input, ScreenWrapper } from "@/core/theme";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { signupSchema, type SignupInput } from "@/features/auth/services/schemas";

export function SignupScreen() {
  const signup = useAuthStore((state) => state.signup);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values);
    } catch (error) {
      setError("root", { message: errorMessage(error) });
    }
  });

  return (
    <ScreenWrapper>
      <View className="gap-8">
        <View className="gap-2">
          <AppText className="text-3xl font-semibold">Create an account</AppText>
          <AppText className="text-muted">The password stays on this device while mock mode is on.</AppText>
        </View>

        <View className="gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                autoComplete="name"
                textContentType="name"
              />
            )}
          />
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
                autoComplete="new-password"
                textContentType="newPassword"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
              />
            )}
          />
          {errors.root?.message ? (
            <AppText className="text-sm text-danger">{errors.root.message}</AppText>
          ) : null}
          <Button label="Create account" loading={isSubmitting} onPress={() => void onSubmit()} />
        </View>

        <Link href="/(auth)/login">
          <AppText>
            Already have an account? <AppText className="text-accent">Sign in</AppText>
          </AppText>
        </Link>
      </View>
    </ScreenWrapper>
  );
}
