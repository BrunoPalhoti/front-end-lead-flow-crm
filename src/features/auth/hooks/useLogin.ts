import { authApi } from "@/features/auth/api/auth.api";
import { useAuthMutation } from "@/features/auth/hooks/useAuthMutation";

export function useLogin() {
  return useAuthMutation(authApi.login);
}
