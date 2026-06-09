import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/features/auth/services/auth.api'
import { useAuthStore } from '@/store/authStore'
import type { LoginPayload } from '@/types/auth'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
    },
  })
}
