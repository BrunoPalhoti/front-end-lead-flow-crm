import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { PageHeader } from "@/shared/components/PageHeader";
import { LeadFormDialog } from "@/features/leads/components/LeadFormDialog";
import { LeadsCardList } from "@/features/leads/components/LeadsCardList";
import { LeadDetailPanel } from "@/features/leads/components/LeadDetailPanel";
import { useLeadsPage } from "@/features/leads/hooks/useLeadsPage";

export function LeadsPage() {
  const {
    leads,
    users,
    isLoading,
    dialogOpen,
    selectedLead,
    isSubmitting,
    handleEdit,
    handleOpenCreate,
    handleCloseDialog,
    handleSelectLead,
    handleSubmit,
  } = useLeadsPage();

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
            onSelect={handleSelectLead}
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
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
