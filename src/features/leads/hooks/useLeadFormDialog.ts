import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useLeadTagOptions } from "@/features/leads/hooks/useLeadTagOptions";
import { useFeedbackSnack } from "@/shared/hooks/useFeedbackSnack";
import { leadSchema, type LeadFormValues } from "@/schemas/lead.schema";
import {
  LEAD_FORM_DEFAULT_VALUES,
  leadToFormValues,
} from "@/features/leads/utils/leadForm";
import { getUserInitials } from "@/utils/lead";
import { formValuesToCreatePayload } from "@/features/leads/utils/leadMappers";
import type { CreateLeadPayload, Lead } from "@/types";

interface UseLeadFormDialogOptions {
  open: boolean;
  initialData?: Lead | null;
  onClose: () => void;
  onSubmit: (values: CreateLeadPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function useLeadFormDialog({
  open,
  initialData,
  onClose,
  onSubmit,
  isSubmitting = false,
}: UseLeadFormDialogOptions) {
  const isEditing = Boolean(initialData);
  const tagOptions = useLeadTagOptions();
  const { data: users = [] } = useUsers();
  const { snack, showSuccess, showError, closeSnack } = useFeedbackSnack();
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, setFocus } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: LEAD_FORM_DEFAULT_VALUES,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "activities",
  });

  const assignedToIdWatched = useWatch({ control, name: "assignedToId" });

  useEffect(() => {
    if (!assignedToIdWatched) return;

    const initials = getUserInitials(users, {
      assignedToId: assignedToIdWatched,
    });

    fields.forEach((field, index) => {
      update(index, { ...field, userInitials: initials });
    });
  }, [assignedToIdWatched, fields, update, users]);

  useEffect(() => {
    if (!open) return;

    reset(initialData ? leadToFormValues(initialData) : LEAD_FORM_DEFAULT_VALUES);
  }, [initialData, open, reset]);

  const handleAddActivity = useCallback(() => {
    const index = fields.length;
    const initials = getUserInitials(users, {
      assignedToId: assignedToIdWatched,
    });

    append({ title: "", date: "", userInitials: initials });
    setTimeout(() => setFocus(`activities.${index}.title`), 50);
  }, [append, assignedToIdWatched, fields.length, setFocus, users]);

  const submitForm = handleSubmit(async (values) => {
    try {
      setSaving(true);
      await onSubmit(formValuesToCreatePayload(values));
      showSuccess(isEditing ? "Lead atualizado" : "Lead criado");
      onClose();
    } catch (error) {
      console.error(error);
      showError("Erro ao salvar lead");
    } finally {
      setSaving(false);
    }
  });

  return {
    isEditing,
    control,
    fields,
    users,
    tagOptions,
    assignedToIdWatched,
    saving,
    isBusy: isSubmitting || saving,
    snack,
    closeSnack,
    remove,
    handleAddActivity,
    submitForm,
  };
}
