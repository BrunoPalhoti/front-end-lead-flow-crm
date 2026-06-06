import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsApi } from '@/api/leads.api'
import { LEADS_QUERY_KEY } from '@/hooks/useLeads'
import type { CreateLeadPayload } from '@/types'

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY })
    },
  })
}
