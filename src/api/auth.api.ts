import { api } from '@/api/axios'
import { isMockMode } from '@/api/mockDb'
import { mockAuth } from '@/api/mockAuth'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (isMockMode) {
      return mockAuth.login(payload)
    }

    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (isMockMode) {
      return mockAuth.register(payload)
    }

    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    return data
  },
}
