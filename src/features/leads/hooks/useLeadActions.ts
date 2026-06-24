import { useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/features/leads/services/leads.api";
import { LEADS_QUERY_KEY } from "@/features/leads/hooks/useLeads";
import type { UpdateLeadPayload, Lead } from "@/types";

export function useLeadActions() {
  const queryClient = useQueryClient();

  async function saveLead(payload: UpdateLeadPayload) {
    await leadsApi.update(payload);
    await queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: [...LEADS_QUERY_KEY, payload.id] });
  }

  async function saveLeadFromForm(
    form: Partial<Lead>,
    currentLead: Lead,
    activity?: { title: string; date?: string; userInitials?: string },
  ) {
    const nextActivities = [
      ...(currentLead.activities ?? []),
      ...(activity ? [activity] : []),
    ];

    const payload: UpdateLeadPayload = {
      id: currentLead.id,
      email: form.email ?? currentLead.email,
      phone: form.phone ?? currentLead.phone,
      company: form.company ?? currentLead.company,
      role: form.role ?? currentLead.role,
      origin: form.origin ?? currentLead.origin,
      assignedToId: (form.assignedToId as string) ?? currentLead.assignedToId,
      value: form.value ?? currentLead.value,
      probability: form.probability ?? currentLead.probability,
      expectedAt: form.expectedAt ?? currentLead.expectedAt,
      tags: form.tags ?? currentLead.tags ?? [],
      activities: nextActivities,
    };

    await leadsApi.update(payload);
    await queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: [...LEADS_QUERY_KEY, payload.id] });
  }

  return { saveLead, saveLeadFromForm } as const;
}

export default useLeadActions;
