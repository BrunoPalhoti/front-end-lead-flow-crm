import { useMemo } from "react";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { getLeadTagOptions } from "@/utils/lead";

export function useLeadTagOptions() {
  const { data: leads = [] } = useLeads();

  return useMemo(() => getLeadTagOptions(leads), [leads]);
}
