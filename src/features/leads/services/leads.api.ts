import { api } from '@/lib/axios'
import { isMockMode, mockDb } from '@/lib/mocks/mockDb'
import type { CreateLeadPayload, Lead, UpdateLeadPayload } from '@/types'

export const leadsApi = {
  async getAll(): Promise<Lead[]> {
    if (isMockMode) {
      return mockDb.getLeads()
    }

    const { data } = await api.get<Lead[]>('/leads')
    return data
  },

  async getById(id: string): Promise<Lead> {
    if (isMockMode) {
      const lead = await mockDb.getLead(id)
      if (!lead) throw new Error('Lead não encontrado')
      return lead
    }

    const { data } = await api.get<Lead>(`/leads/${id}`)
    return data
  },

  async create(payload: CreateLeadPayload): Promise<Lead> {
    if (isMockMode) {
      return mockDb.createLead({
        stage: 'new',
        ...payload,
      })
    }

    const { data } = await api.post<Lead>('/leads', payload)
    return data
  },

  async update({ id, ...payload }: UpdateLeadPayload): Promise<Lead> {
    if (isMockMode) {
      return mockDb.updateLead(id, payload)
    }

    const { data } = await api.patch<Lead>(`/leads/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    if (isMockMode) {
      return mockDb.deleteLead(id)
    }

    await api.delete(`/leads/${id}`)
  },
}
