import { useCallback, useState } from "react";
import { useLeadActions } from "@/features/leads/hooks/useLeadActions";
import { useLeadForm } from "@/features/leads/hooks/useLeadForm";
import { useLeadTagOptions } from "@/features/leads/hooks/useLeadTagOptions";
import { useFeedbackSnack } from "@/shared/hooks/useFeedbackSnack";
import { useAuthStore } from "@/store/authStore";
import { getInitialsFromName, getUserInitials } from "@/utils/lead";
import type { Lead, User } from "@/types";

export function useLeadEditor(lead: Lead | null, users: User[]) {
  const auth = useAuthStore((state) => state.user);
  const tagOptions = useLeadTagOptions();
  const { form, setForm, isEditing, setIsEditing } = useLeadForm(lead);
  const { saveLeadFromForm } = useLeadActions();
  const { snack, showSuccess, showError, closeSnack } = useFeedbackSnack();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmSave = useCallback(async () => {
    if (!lead) return;

    setShowConfirm(false);
    const now = new Date().toISOString();
    const userInitials = getUserInitials(users, {
      authName: auth?.name,
      assignedToId: (form.assignedToId as string) ?? lead.assignedToId,
    });

    try {
      await saveLeadFromForm(form, lead, {
        title: "Lead atualizado",
        date: now,
        userInitials,
      });
      showSuccess("Alterações salvas");
      setIsEditing(false);
    } catch (error) {
      console.error("Falha ao salvar lead", error);
      showError("Erro ao salvar alterações");
    }
  }, [
    auth?.name,
    form,
    lead,
    saveLeadFromForm,
    setIsEditing,
    showError,
    showSuccess,
    users,
  ]);

  const initials = lead ? getInitialsFromName(lead.name) : "";
  const responsible = lead
    ? users.find((user) => user.id === lead.assignedToId)
    : undefined;
  const activities = lead?.activities ?? [];

  return {
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
  };
}
