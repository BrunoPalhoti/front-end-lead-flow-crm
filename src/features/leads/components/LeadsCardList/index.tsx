import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrency } from "@/utils/formatCurrency";
import { LeadStatusChip } from "@/features/leads/components/LeadStatusChip";
import type { Lead, User } from "@/types";

interface Props {
  leads: Lead[];
  users: User[];
  isLoading: boolean;
  selectedLeadId?: string | null;
  onSelect: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
}

export function LeadsCardList({
  leads,
  users,
  isLoading,
  selectedLeadId,
  onSelect,
  onEdit,
}: Props) {
  const usersMap = new Map(users.map((u) => [u.id, u.name]));

  return (
    <Box>
      <Stack spacing={2}>
        {isLoading ? (
          <Box>
            <Typography>Carregando...</Typography>
          </Box>
        ) : leads.length === 0 ? (
          <Box>
            <Typography>Nenhum lead encontrado.</Typography>
          </Box>
        ) : (
          leads.map((lead) => {
            const isSelected = selectedLeadId === lead.id;
            return (
              <Box key={lead.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    border: isSelected
                      ? (theme) => `2px solid ${theme.palette.primary.main}`
                      : undefined,
                    bgcolor: isSelected ? "action.selected" : undefined,
                  }}
                  onClick={() => onSelect(lead)}
                  role="button"
                  aria-label={`Selecionar lead ${lead.name}`}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">{lead.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.company ?? "—"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.email}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="subtitle2">
                          {usersMap.get(lead.assignedToId ?? "") ?? "—"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(lead.value)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <LeadStatusChip stage={lead.stage} />
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(lead);
                      }}
                    >
                      Editar
                    </Button>
                  </Box>
                </Card>
              </Box>
            );
          })
        )}
      </Stack>
    </Box>
  );
}

export default LeadsCardList;
