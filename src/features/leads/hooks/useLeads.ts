import { useQuery } from '@tanstack/react-query'
import { leadsApi } from '@/features/leads/services/leads.api'

export const LEADS_QUERY_KEY = ['leads'] as const

export function useLeads() {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: leadsApi.getAll,
  })
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, id],
    queryFn: () => leadsApi.getById(id),
    enabled: Boolean(id),
  })
}
