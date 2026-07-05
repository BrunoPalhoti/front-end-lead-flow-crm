import { useQuery } from "@tanstack/react-query";
import { leadsApi } from "@/features/leads/api/leads.api";
import { LEADS_QUERY_KEY } from "@/features/leads/api/queryKeys";

export { LEADS_QUERY_KEY };

export function useLeads() {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: leadsApi.getAll,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, id],
    queryFn: () => leadsApi.getById(id),
    enabled: Boolean(id),
  });
}
