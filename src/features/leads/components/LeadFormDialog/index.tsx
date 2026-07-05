import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { RHFTextField } from "@/shared/components/RHFTextField";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { leadSchema, type LeadFormValues } from "@/schemas/lead.schema";
import { FUNNEL_STAGES, LEAD_STAGE_LABELS, type Lead } from "@/types";
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
  isSubmitting = false,
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

  // sincronizar userInitials das atividades quando responsável mudar
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

            <RHFTextField name="cnpj" control={control} label="CNPJ" />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <RHFTextField name="role" control={control} label="Cargo" />
              <RHFTextField name="origin" control={control} label="Origem" />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Estágio" fullWidth>
                    {FUNNEL_STAGES.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {LEAD_STAGE_LABELS[stage]}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="value"
                control={control}
                render={({
                  field: { onChange, value, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    {...field}
                    value={value ?? ""}
                    onChange={(event) => {
                      const next = event.target.value;
                      onChange(next === "" ? undefined : Number(next));
                    }}
                    label="Valor (R$)"
                    type="number"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="probability"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value ?? ""}
                    onChange={(e) =>
                      onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    label="Probabilidade (%)"
                    type="number"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="expectedAt"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data prevista"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Stack>

            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Responsável" fullWidth>
                  <MenuItem value="">Nenhum</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={tagOptions}
                  value={field.value ?? []}
                  onChange={(_, v) => field.onChange(v)}
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" />
                  )}
                />
              )}
            />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2">Atividades</Typography>
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => {
                    const idx = fields.length;
                    const user = users.find(
                      (u) => u.id === assignedToIdWatched,
                    );
                    const initials = user
                      ? user.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : undefined;
                    append({ title: "", date: "", userInitials: initials });
                    setTimeout(() => setFocus(`activities.${idx}.title`), 50);
                  }}
                >
                  Adicionar
                </Button>
              </Box>

              {fields.map((f, idx) => (
                <Stack
                  key={f.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <RHFTextField
                    name={`activities.${idx}.title`}
                    control={control}
                    label="Título"
                  />
                  <Controller
                    name={`activities.${idx}.date` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Data"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                  <Controller
                    name={`activities.${idx}.userInitials` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Responsável (iniciais)"
                        disabled
                      />
                    )}
                  />
                  <IconButton aria-label="remover" onClick={() => remove(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Box>

            <RHFTextField
              name="notes"
              control={control}
              label="Observações"
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting || saving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || saving}
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {isEditing ? "Salvar" : "Criar lead"}
          </Button>
        </DialogActions>
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
      </form>
    </Dialog>
  );
}

export default LeadFormDialog;
