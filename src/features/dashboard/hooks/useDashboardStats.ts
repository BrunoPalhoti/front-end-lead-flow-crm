import { useMemo } from "react";
import { useLeads } from "@/features/leads/hooks/useLeads";
import type { DashboardStats } from "@/features/dashboard/types/dashboardStats";
import {
  countLeadsByStage,
  filterLeadsByStage,
  sumLeadValues,
} from "@/utils/lead";

export function useDashboardStats() {
  const { data: leads = [], isLoading } = useLeads();

  const stats = useMemo((): DashboardStats => {
    const total = leads.length;
    const won = filterLeadsByStage(leads, "won");
    const pipeline = leads.filter(
      (lead) => lead.stage !== "won" && lead.stage !== "lost",
    );

    return {
      total,
      pipelineValue: sumLeadValues(pipeline),
      wonValue: sumLeadValues(won),
      conversionRate: total > 0 ? (won.length / total) * 100 : 0,
      byStage: countLeadsByStage(leads),
    };
  }, [leads]);

  return { stats, leads, isLoading };
}
