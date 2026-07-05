import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { RHFTextField } from "@/shared/components/RHFTextField";
import { useLeadFormDialog } from "@/features/leads/hooks/useLeadFormDialog";
import { FeedbackAlert } from "@/shared/components/FeedbackAlert";
import { FUNNEL_STAGES, LEAD_STAGE_LABELS, type Lead } from "@/types";
import type { CreateLeadPayload } from "@/types";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateLeadPayload) => Promise<void>;
  initialData?: Lead | null;
  isSubmitting?: boolean;
}

export function LeadFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: LeadFormDialogProps) {
  const {
    isEditing,
    control,
    fields,
    users,
    tagOptions,
    isBusy,
    snack,
    closeSnack,
    remove,
    handleAddActivity,
    submitForm,
  } = useLeadFormDialog({ open, initialData, onClose, onSubmit, isSubmitting });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Editar lead" : "Novo lead"}</DialogTitle>

      <form onSubmit={submitForm}>
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
                    slotProps={{ inputLabel: { shrink: true } }}
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
                  onChange={(_, value) => field.onChange(value)}
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
                  onClick={handleAddActivity}
                >
                  Adicionar
                </Button>
              </Box>

              {fields.map((field, index) => (
                <Stack
                  key={field.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mb: 1, alignItems: "center" }}
                >
                  <RHFTextField
                    name={`activities.${index}.title`}
                    control={control}
                    label="Título"
                  />
                  <Controller
                    name={`activities.${index}.date` as const}
                    control={control}
                    render={({ field: dateField }) => (
                      <TextField
                        {...dateField}
                        type="date"
                        label="Data"
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    )}
                  />
                  <Controller
                    name={`activities.${index}.userInitials` as const}
                    control={control}
                    render={({ field: initialsField }) => (
                      <TextField
                        {...initialsField}
                        label="Responsável (iniciais)"
                        disabled
                      />
                    )}
                  />
                  <IconButton
                    aria-label="remover"
                    onClick={() => remove(index)}
                  >
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
          <Button onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isBusy}
            startIcon={
              isBusy ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {isEditing ? "Salvar" : "Criar lead"}
          </Button>
        </DialogActions>

        <FeedbackAlert
          open={snack.open}
          message={snack.message}
          severity={snack.severity}
          onClose={closeSnack}
        />
      </form>
    </Dialog>
  );
}

export default LeadFormDialog;
