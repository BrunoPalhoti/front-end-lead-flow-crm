import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { LeadDetailPanelProps } from "@/features/leads/types/componentTypes";
import { LeadHeader } from "@/features/leads/components/LeadHeader";
import { LeadFields } from "@/features/leads/components/LeadFields";
import { LeadActivities } from "@/features/leads/components/LeadActivities";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useAuthStore } from "@/store/authStore";
import { useLeadForm } from "@/features/leads/hooks/useLeadForm";
import { useLeadActions } from "@/features/leads/hooks/useLeadActions";

export function LeadDetailPanel({ lead, users }: LeadDetailPanelProps) {
  const auth = useAuthStore((s) => s.user);

  const { data: leads = [] } = useLeads();
  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) {
      if (Array.isArray(l.tags)) l.tags.forEach((t) => set.add(t));
    }
    return Array.from(set);
  }, [leads]);

  const { form, setForm, isEditing, setIsEditing } = useLeadForm(lead);
  const { saveLeadFromForm } = useLeadActions();

  const [showConfirm, setShowConfirm] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  if (!lead) return <div>Selecione um lead para ver detalhes</div>;

  const currentLead = lead;
  const responsible = users.find((u) => u.id === currentLead.assignedToId);
  const activities = currentLead.activities ?? [];

  const initials = currentLead.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  function getUserInitials() {
    if (auth && auth.name) {
      return auth.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }

    const uid = (form.assignedToId as string) ?? currentLead.assignedToId;
    const u = users.find((x) => x.id === uid);
    if (u)
      return u.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return undefined;
  }

  async function handleConfirmSave() {
    setShowConfirm(false);
    const now = new Date().toISOString();
    const initials = getUserInitials();

    try {
      await saveLeadFromForm(form, currentLead, {
        title: "Lead atualizado",
        date: now,
        userInitials: initials,
      });
      setSnack({
        open: true,
        message: "Alterações salvas",
        severity: "success",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Falha ao salvar lead", err);
      setSnack({
        open: true,
        message: "Erro ao salvar alterações",
        severity: "error",
      });
    }
  }

  return (
    <Box key={currentLead.id}>
      <LeadHeader lead={currentLead} users={users} initials={initials} />

      <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
        <LeadFields
          currentLead={currentLead}
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
          currentLead={currentLead}
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

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LeadDetailPanel;
