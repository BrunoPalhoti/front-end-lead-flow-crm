import { useCallback } from "react";
import { useUpdateLead } from "@/features/leads/hooks/useUpdateLead";
import type { Lead, LeadStage } from "@/types";

export function useFunnelDragDrop(leads: Lead[]) {
  const updateLead = useUpdateLead();

  const handleDragStart = useCallback(
    (event: React.DragEvent, leadId: string) => {
      event.dataTransfer.setData("leadId", leadId);
      event.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent, stage: LeadStage) => {
      event.preventDefault();
      const leadId = event.dataTransfer.getData("leadId");
      if (!leadId) return;

      const lead = leads.find((item) => item.id === leadId);
      if (!lead || lead.stage === stage) return;

      updateLead.mutate({ id: leadId, stage });
    },
    [leads, updateLead],
  );

  return { handleDragStart, handleDrop };
}
