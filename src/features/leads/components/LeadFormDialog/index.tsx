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
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { RHFTextField } from "@/shared/components/RHFTextField";
import { useUsers } from "@/features/users/hooks/useUsers";
import { leadSchema, type LeadFormValues } from "@/schemas/lead.schema";
import { FUNNEL_STAGES, LEAD_STAGE_LABELS, type Lead } from "@/types";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
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
};

export function LeadFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: LeadFormDialogProps) {
  const { data: users = [] } = useUsers();
  const isEditing = Boolean(initialData);

  const { control, handleSubmit, reset } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name: initialData.name,
              email: initialData.email,
              phone: initialData.phone ?? "",
              company: initialData.company ?? "",
              stage: initialData.stage,
              value: initialData.value,
              assignedToId: initialData.assignedToId ?? "",
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
          await onSubmit(values);
          onClose();
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
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEditing ? "Salvar" : "Criar lead"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LeadFormDialog;
