import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsApi } from '@/features/leads/services/leads.api'
import { LEADS_QUERY_KEY } from '@/features/leads/hooks/useLeads'
import type { UpdateLeadPayload } from '@/types'

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => leadsApi.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY })
    },
  })
}
