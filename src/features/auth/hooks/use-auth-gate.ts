import { features } from "@/core/config";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";

export type ProtectedGate = "boot" | "allow" | "login" | "unlock";
export type GuestGate = "boot" | "allow" | "app" | "login" | "unlock";

export function useProtectedGate(): ProtectedGate {
  const status = useAuthStore((state) => state.status);

  if (!features.auth) {
    return "allow";
  }
  if (status === "booting") {
    return "boot";
  }
  if (status === "locked") {
    return "unlock";
  }
  if (status === "authenticated") {
    return "allow";
  }
  return "login";
}

export function useGuestGate(segments: readonly string[]): GuestGate {
  const status = useAuthStore((state) => state.status);
  const leaf = segments[segments.length - 1];

  if (!features.auth) {
    return "app";
  }
  if (status === "booting") {
    return "boot";
  }
  if (status === "authenticated") {
    return "app";
  }
  if (status === "locked" && leaf !== "unlock") {
    return "unlock";
  }
  if (status !== "locked" && leaf === "unlock") {
    return "login";
  }
  return "allow";
}
