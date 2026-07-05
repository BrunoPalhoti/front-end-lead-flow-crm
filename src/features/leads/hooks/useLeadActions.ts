import { useCallback } from "react";
import { useUpdateLead } from "@/features/leads/hooks/useUpdateLead";
import type { Lead, UpdateLeadPayload } from "@/types";

export function useLeadActions() {
  const updateLead = useUpdateLead();

  const saveLeadFromForm = useCallback(
    async (
      form: Partial<Lead>,
      currentLead: Lead,
      activity?: { title: string; date?: string; userInitials?: string },
    ) => {
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

      await updateLead.mutateAsync(payload);
    },
    [updateLead],
  );

  return { saveLeadFromForm } as const;
}
