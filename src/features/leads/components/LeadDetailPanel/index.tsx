import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { LeadDetailPanelProps } from "@/features/leads/types/componentTypes";
import { LeadHeader } from "@/features/leads/components/LeadHeader";
import { LeadFields } from "@/features/leads/components/LeadFields";
import { LeadActivities } from "@/features/leads/components/LeadActivities";
import { useLeadEditor } from "@/features/leads/hooks/useLeadEditor";
import { FeedbackAlert } from "@/shared/components/FeedbackAlert";

export function LeadDetailPanel({ lead, users }: LeadDetailPanelProps) {
  const {
    tagOptions,
    form,
    setForm,
    isEditing,
    setIsEditing,
    showConfirm,
    setShowConfirm,
    snack,
    closeSnack,
    handleConfirmSave,
    initials,
    responsible,
    activities,
  } = useLeadEditor(lead, users);

  if (!lead) return <div>Selecione um lead para ver detalhes</div>;

  return (
    <Box key={lead.id}>
      <LeadHeader lead={lead} initials={initials} />

      <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
        <LeadFields
          currentLead={lead}
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setShowConfirm={setShowConfirm}
          users={users}
          tagOptions={tagOptions}
          responsible={responsible}
        />

        <Divider orientation="vertical" flexItem />

        <LeadActivities
          activities={activities}
          initials={initials}
          currentLead={lead}
        />
      </Box>

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Confirmar alterações</DialogTitle>
        <DialogContent>Deseja salvar as alterações deste lead?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmSave}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={closeSnack}
      />
    </Box>
  );
}

export default LeadDetailPanel;
