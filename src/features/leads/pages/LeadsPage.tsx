import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { useCreateLead } from "@/features/leads/hooks/useCreateLead";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useUpdateLead } from "@/features/leads/hooks/useUpdateLead";
import { useUsers } from "@/features/users/hooks/useUsers";
import { LeadFormDialog } from "@/features/leads/components/LeadFormDialog";
import { LeadsCardList } from "@/features/leads/components/LeadsCardList";
import { LeadDetailPanel } from "@/features/leads/components/LeadDetailPanel";
import type { Lead } from "@/types";
import type { CreateLeadPayload } from "@/types";

export function LeadsPage() {
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
      return leads.find((l) => l.id === selectedLeadId) ?? null;
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

  async function handleSubmit(values: CreateLeadPayload) {
    const payload = {
      ...values,
      phone: values.phone || undefined,
      company: values.company || undefined,
      assignedToId: values.assignedToId || undefined,
      notes: values.notes || undefined,
      cnpj: values.cnpj || undefined,
      role: values.role || undefined,
      origin: values.origin || undefined,
      probability: values.probability ?? undefined,
      expectedAt: values.expectedAt ?? undefined,
      tags: values.tags && values.tags.length > 0 ? values.tags : undefined,
      activities:
        values.activities && values.activities.length > 0
          ? values.activities
          : undefined,
    };

    if (selectedLead) {
      await updateLead.mutateAsync({ id: selectedLead.id, ...payload });
    } else {
      await createLead.mutateAsync(payload);
    }

    setSelectedLeadId(null);
  }

  return (
    <Box>
      <PageHeader
        title="Leads"
        subtitle="Gerencie todos os leads do funil comercial"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Novo lead
          </Button>
        }
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ width: 360, maxHeight: "72vh", overflow: "auto" }}>
          <LeadsCardList
            leads={leads}
            users={users}
            isLoading={isLoading}
            selectedLeadId={selectedLead?.id ?? null}
            onSelect={(lead) => setSelectedLeadId(lead.id)}
            onEdit={handleEdit}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <LeadDetailPanel lead={selectedLead} users={users} />
        </Box>
      </Box>

      <LeadFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialData={selectedLead}
        isSubmitting={createLead.isPending || updateLead.isPending}
      />
    </Box>
  );
}
