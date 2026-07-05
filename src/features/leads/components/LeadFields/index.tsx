import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { Lead, User } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  currentLead: Lead;
  form: Partial<Lead>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Lead>>>;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  setShowConfirm: (v: boolean) => void;
  users: User[];
  tagOptions: string[];
  responsible?: User;
}

export function LeadFields({
  currentLead,
  form,
  setForm,
  isEditing,
  setIsEditing,
  setShowConfirm,
  users,
  tagOptions,
  responsible,
}: Props) {
  return (
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">Informações principais</Typography>
        {!isEditing ? (
          <Button
            startIcon={<EditOutlinedIcon />}
            size="small"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => {
                setForm({ ...currentLead });
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setShowConfirm(true)}
            >
              Salvar
            </Button>
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            rowGap: 8,
            columnGap: 16,
          }}
        >
          <Typography color="text.secondary">E-mail</Typography>
          {!isEditing ? (
            <Typography>{currentLead.email}</Typography>
          ) : (
            <TextField
              fullWidth
              value={form.email ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          )}

          <Typography color="text.secondary">Telefone</Typography>
          {!isEditing ? (
            <Typography>{currentLead.phone ?? "—"}</Typography>
          ) : (
            <TextField
              fullWidth
              value={form.phone ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          )}

          <Typography color="text.secondary">Empresa</Typography>
          {!isEditing ? (
            <Typography>{currentLead.company ?? "—"}</Typography>
          ) : (
            <TextField
              fullWidth
              value={form.company ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
            />
          )}

          <Typography color="text.secondary">Cargo</Typography>
          {!isEditing ? (
            <Typography>{currentLead.role ?? "—"}</Typography>
          ) : (
            <TextField
              fullWidth
              value={form.role ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          )}

          <Typography color="text.secondary">Origem</Typography>
          {!isEditing ? (
            <Typography>{currentLead.origin ?? "—"}</Typography>
          ) : (
            <TextField
              fullWidth
              value={form.origin ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, origin: e.target.value }))
              }
            />
          )}

          <Typography color="text.secondary">Responsável</Typography>
          {!isEditing ? (
            <Typography>{responsible ? responsible.name : "—"}</Typography>
          ) : (
            <TextField
              select
              fullWidth
              value={form.assignedToId ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, assignedToId: e.target.value }))
              }
              slotProps={{ select: { native: true } }}
            >
              <option value="">Nenhum</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </TextField>
          )}

          <Typography color="text.secondary">Criado em</Typography>
          <Typography>
            {new Date(currentLead.createdAt).toLocaleString()}
          </Typography>

          <Typography color="text.secondary">Valor estimado</Typography>
          {!isEditing ? (
            <Typography>{formatCurrency(currentLead.value)}</Typography>
          ) : (
            <TextField
              fullWidth
              type="number"
              value={form.value ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  value:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          )}

          <Typography color="text.secondary">Probabilidade</Typography>
          {!isEditing ? (
            <Typography>
              {currentLead.probability !== undefined &&
              currentLead.probability !== null
                ? `${currentLead.probability}%`
                : "—"}
            </Typography>
          ) : (
            <TextField
              fullWidth
              type="number"
              value={form.probability ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  probability:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          )}

          <Typography color="text.secondary">Data prevista</Typography>
          {!isEditing ? (
            <Typography>
              {currentLead.expectedAt
                ? new Date(currentLead.expectedAt).toLocaleDateString()
                : "—"}
            </Typography>
          ) : (
            <TextField
              fullWidth
              type="date"
              value={form.expectedAt ? form.expectedAt.slice(0, 10) : ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  expectedAt: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                }))
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}

          <Box sx={{ mt: 2 }} />
          {!isEditing ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {(currentLead.tags ?? []).map((t: string) => (
                <Chip key={t} label={t} size="small" />
              ))}
              <Chip label="+" size="small" />
            </Box>
          ) : (
            <Autocomplete
              multiple
              freeSolo
              options={tagOptions}
              value={(form.tags as string[]) ?? []}
              onChange={(_, v) => setForm((f) => ({ ...f, tags: v }))}
              renderInput={(params) => <TextField {...params} label="Tags" />}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default LeadFields;
