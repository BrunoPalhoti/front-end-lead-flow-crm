import { useCallback, useMemo, useState } from "react";
import { useCreateLead } from "@/features/leads/hooks/useCreateLead";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useUpdateLead } from "@/features/leads/hooks/useUpdateLead";
import { useUsers } from "@/features/users/hooks/useUsers";
import { normalizeCreateLeadPayload } from "@/features/leads/utils/leadMappers";
import type { CreateLeadPayload, Lead } from "@/types";

export function useLeadsPage() {
  const { data: leads = [], isLoading } = useLeads();
  const { data: users = [] } = useUsers();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null | undefined>(
    undefined,
  );

  const selectedLead = useMemo(() => {
    if (selectedLeadId === null) return null;
    if (selectedLeadId) {
      return leads.find((lead) => lead.id === selectedLeadId) ?? null;
    }
    return leads[0] ?? null;
  }, [leads, selectedLeadId]);

  const handleEdit = useCallback((lead: Lead) => {
    setSelectedLeadId(lead.id);
    setDialogOpen(true);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedLeadId(null);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedLeadId(null);
  }, []);

  const handleSelectLead = useCallback((lead: Lead) => {
    setSelectedLeadId(lead.id);
  }, []);

  const handleSubmit = useCallback(
    async (values: CreateLeadPayload) => {
      const payload = normalizeCreateLeadPayload(values);

      if (selectedLead) {
        await updateLead.mutateAsync({ id: selectedLead.id, ...payload });
      } else {
        await createLead.mutateAsync(payload);
      }

      setSelectedLeadId(null);
    },
    [createLead, selectedLead, updateLead],
  );

  return {
    leads,
    users,
    isLoading,
    dialogOpen,
    selectedLead,
    isSubmitting: createLead.isPending || updateLead.isPending,
    handleEdit,
    handleOpenCreate,
    handleCloseDialog,
    handleSelectLead,
    handleSubmit,
  };
}
