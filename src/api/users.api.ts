import { api } from '@/api/axios'
import { isMockMode, mockDb } from '@/api/mockDb'
import type { User } from '@/types'

export const usersApi = {
  async getAll(): Promise<User[]> {
    if (isMockMode) {
      return mockDb.getUsers()
    }

    const { data } = await api.get<User[]>('/users')
    return data
  },

  async getById(id: string): Promise<User> {
    if (isMockMode) {
      const users = await mockDb.getUsers()
      const user = users.find((item) => item.id === id)
      if (!user) throw new Error('Usuário não encontrado')
      return user
    }

    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },
}
