import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/features/leads/api/leads.api";
import { LEADS_QUERY_KEY } from "@/features/leads/api/queryKeys";
import type { UpdateLeadPayload } from "@/types";

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => leadsApi.update(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LEADS_QUERY_KEY, variables.id],
      });
    },
  });
}
