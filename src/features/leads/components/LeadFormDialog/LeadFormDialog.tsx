import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { RHFTextField } from "@/shared/components/RHFTextField";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { leadSchema, type LeadFormValues } from "@/schemas/lead.schema";
import { type Lead } from "@/types";
import type { CreateLeadPayload } from "@/types";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateLeadPayload) => Promise<void>;
  initialData?: Lead | null;
  isSubmitting?: boolean;
}

const defaultValues: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  stage: "new",
  value: undefined,
  assignedToId: "",
  notes: "",
  cnpj: "",
  role: "",
  origin: "",
  probability: undefined,
  expectedAt: "",
  tags: [],
  activities: [],
};

export function LeadFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: LeadFormDialogProps) {
  const isEditing = Boolean(initialData);

  const { control, handleSubmit, reset, setFocus } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues,
  });

  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "activities",
  });

  const { data: leads = [] } = useLeads();
  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) {
      if (Array.isArray(l.tags)) l.tags.forEach((t) => set.add(t));
    }
    return Array.from(set);
  }, [leads]);

  const assignedToIdWatched = useWatch({ control, name: "assignedToId" });
  const { data: users = [] } = useUsers();

  useEffect(() => {
    if (!assignedToIdWatched) return;
    const user = users.find((u) => u.id === assignedToIdWatched);
    const initials = user
      ? user.name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : undefined;

    fields.forEach((f, idx) => {
      update(idx, { ...f, userInitials: initials });
    });
  }, [assignedToIdWatched, users, fields, update]);

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name: initialData.name,
              email: initialData.email,
              phone: initialData.phone ?? "",
              company: initialData.company ?? "",
              cnpj: initialData.cnpj ?? "",
              role: initialData.role ?? "",
              origin: initialData.origin ?? "",
              stage: initialData.stage,
              value: initialData.value,
              assignedToId: initialData.assignedToId ?? "",
              probability: initialData.probability ?? undefined,
              expectedAt: initialData.expectedAt
                ? initialData.expectedAt.slice(0, 10)
                : "",
              tags: initialData.tags ?? [],
              activities: initialData.activities ?? [],
              notes: initialData.notes ?? "",
            }
          : defaultValues,
      );
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Editar lead" : "Novo lead"}</DialogTitle>

      <form
        onSubmit={handleSubmit(async (values) => {
          const payload: CreateLeadPayload = {
            name: values.name,
            email: values.email,
            phone: values.phone || undefined,
            company: values.company || undefined,
            cnpj: values.cnpj || undefined,
            role: values.role || undefined,
            origin: values.origin || undefined,
            stage: values.stage,
            value: values.value ?? undefined,
            assignedToId: values.assignedToId || undefined,
            notes: values.notes || undefined,
            probability: values.probability ?? undefined,
            expectedAt: values.expectedAt
              ? new Date(values.expectedAt).toISOString()
              : undefined,
            tags: values.tags ?? [],
            activities: values.activities ?? [],
          };

          try {
            setSaving(true);
            await onSubmit(payload);
            setSnack({
              open: true,
              message: isEditing ? "Lead atualizado" : "Lead criado",
              severity: "success",
            });
            onClose();
          } catch (err) {
            console.error(err);
            setSnack({
              open: true,
              message: "Erro ao salvar lead",
              severity: "error",
            });
          } finally {
            setSaving(false);
          }
        })}
      >
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <RHFTextField name="name" control={control} label="Nome" />
            <RHFTextField
              name="email"
              control={control}
              label="E-mail"
              type="email"
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <RHFTextField name="phone" control={control} label="Telefone" />
              <RHFTextField name="company" control={control} label="Empresa" />
            </Stack>