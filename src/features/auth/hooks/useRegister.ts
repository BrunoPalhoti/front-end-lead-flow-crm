import { authApi } from "@/features/auth/api/auth.api";
import { useAuthMutation } from "@/features/auth/hooks/useAuthMutation";

export function useRegister() {
  return useAuthMutation(authApi.register);
}
