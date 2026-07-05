import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import type { AuthResponse } from "@/types/auth";

export function useAuthMutation<TPayload>(
  mutationFn: (payload: TPayload) => Promise<AuthResponse>,
) {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}
