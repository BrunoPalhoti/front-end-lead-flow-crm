import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Autocomplete from "@mui/material/Autocomplete";
import { formatCurrency } from "@/utils/formatCurrency";
import { LeadStatusChip } from "@/features/leads/components/LeadStatusChip";
import { useMemo, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/features/leads/services/leads.api";
import { useLeads, LEADS_QUERY_KEY } from "@/features/leads/hooks/useLeads";
import { useAuthStore } from "@/store/authStore";
import type { Lead, User } from "@/types";

interface LeadDetailPanelProps {
  lead: Lead | null;
  users: User[];
}

export function LeadDetailPanel({ lead, users }: LeadDetailPanelProps) {
  const queryClient = useQueryClient();
  const auth = useAuthStore((s) => s.user);

  const { data: leads = [] } = useLeads();
  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) {
      if (Array.isArray(l.tags)) l.tags.forEach((t) => set.add(t));
    }
    return Array.from(set);
  }, [leads]);

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<Partial<Lead>>(() =>
    lead ? { ...lead } : {},
  );
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // `form` is initialized from `lead`. We rely on the component remount
  // (via `key={lead.id}` below) when a different lead is selected to reset state
  // and avoid calling `setState` synchronously inside an effect.

  if (!lead) {
    return <Typography>Selecione um lead para ver detalhes</Typography>;
  }

  const responsible = users.find((u) => u.id === lead.assignedToId);
  const tags = (lead as any).tags ?? [];
  const activities = (lead as any).activities ?? [];

  const initials = lead.name
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

    const uid = (form.assignedToId as string) ?? lead.assignedToId;
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
    try {
      setShowConfirm(false);
      const now = new Date().toISOString();
      const initials = getUserInitials();

      const nextActivities = [
        ...(lead.activities ?? []),
        { title: "Lead atualizado", date: now, userInitials: initials },
      ];

      const payload: any = {
        id: lead.id,
        email: form.email ?? undefined,
        phone: form.phone ?? undefined,
        company: form.company ?? undefined,
        role: (form as any).role ?? undefined,
        origin: (form as any).origin ?? undefined,
        assignedToId: form.assignedToId ?? undefined,
        value: form.value ?? undefined,
        probability: (form as any).probability ?? undefined,
        expectedAt: form.expectedAt ?? undefined,
        tags: (form.tags as string[]) ?? lead.tags ?? [],
        activities: nextActivities,
      };
      try {
        await leadsApi.update(payload);
        // garantir sincronização futura
        await queryClient.invalidateQueries(LEADS_QUERY_KEY);
        await queryClient.invalidateQueries([...LEADS_QUERY_KEY, lead.id]);
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
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        message: "Erro ao salvar alterações",
        severity: "error",
      });
    }
  }

  return (
    <Box key={lead.id}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar sx={{ width: 64, height: 64 }}>{initials}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="h6">{lead.name}</Typography>
            <LeadStatusChip stage={lead.stage} />
          </Box>
          <Typography color="text.secondary">{lead.company ?? "—"}</Typography>
          <Typography color="text.secondary" variant="body2">
            {lead.cnpj ?? ""}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="phone"
            href={`tel:${lead.phone ?? ""}`}
            size="small"
          >
            <PhoneIcon />
          </IconButton>
          <IconButton
            aria-label="email"
            href={`mailto:${lead.email}`}
            size="small"
          >
            <EmailIcon />
          </IconButton>
          <IconButton
            aria-label="whatsapp"
            href={
              lead.phone
                ? `https://wa.me/${lead.phone.replace(/\D/g, "")}`
                : undefined
            }
            size="small"
          >
            <WhatsAppIcon />
          </IconButton>
          <IconButton aria-label="more" size="small">
            <MoreHorizIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
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
                    setForm({ ...lead });
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
                <Typography>{lead.email}</Typography>
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
                <Typography>{lead.phone ?? "—"}</Typography>
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
                <Typography>{lead.company ?? "—"}</Typography>
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
                <Typography>{(lead as any).role ?? "—"}</Typography>
              ) : (
                <TextField
                  fullWidth
                  value={(form as any).role ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                />
              )}

              <Typography color="text.secondary">Origem</Typography>
              {!isEditing ? (
                <Typography>{(lead as any).origin ?? "—"}</Typography>
              ) : (
                <TextField
                  fullWidth
                  value={(form as any).origin ?? ""}
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
                  SelectProps={{ native: true }}
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
                {new Date(lead.createdAt).toLocaleString()}
              </Typography>

              <Typography color="text.secondary">Valor estimado</Typography>
              {!isEditing ? (
                <Typography>{formatCurrency(lead.value)}</Typography>
              ) : (
                <TextField
                  fullWidth
                  type="number"
                  value={form.value ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      value:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    }))
                  }
                />
              )}

              <Typography color="text.secondary">Probabilidade</Typography>
              {!isEditing ? (
                <Typography>
                  {(lead as any).probability !== undefined &&
                  (lead as any).probability !== null
                    ? `${(lead as any).probability}%`
                    : "—"}
                </Typography>
              ) : (
                <TextField
                  fullWidth
                  type="number"
                  value={(form as any).probability ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      probability:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    }))
                  }
                />
              )}

              <Typography color="text.secondary">Data prevista</Typography>
              {!isEditing ? (
                <Typography>
                  {(lead as any).expectedAt
                    ? new Date((lead as any).expectedAt).toLocaleDateString()
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
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              {!isEditing ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {tags.map((t: string) => (
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
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" />
                  )}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ width: 320 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">Atividades recentes</Typography>
            <Button size="small">Ver todas</Button>
          </Box>

          <List>
            {activities.length > 0 ? (
              activities.map((act: any, idx: number) => (
                <ListItem key={idx} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {act.userInitials ?? initials}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={act.title}
                    secondary={
                      act.date ? new Date(act.date).toLocaleString() : ""
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={lead.notes ?? "Sem atividades"}
                  secondary={
                    lead.updatedAt
                      ? new Date(lead.updatedAt).toLocaleString()
                      : undefined
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>
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
