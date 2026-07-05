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
import { getUserName } from "@/utils/lead";
import { LeadStatusChip } from "@/features/leads/components/LeadStatusChip";
import { LeadSummary } from "@/features/leads/components/LeadSummary";
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
  return (
    <Box>
      <Stack spacing={2}>
        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : leads.length === 0 ? (
          <Typography>Nenhum lead encontrado.</Typography>
        ) : (
          leads.map((lead) => {
            const isSelected = selectedLeadId === lead.id;

            return (
              <Card
                key={lead.id}
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
                    <LeadSummary
                      lead={lead}
                      nameVariant="h6"
                      subtitleVariant="body2"
                    />
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2">
                        {getUserName(users, lead.assignedToId)}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(lead);
                    }}
                  >
                    Editar
                  </Button>
                </Box>
              </Card>
            );
          })
        )}
      </Stack>
    </Box>
  );
}

export default LeadsCardList;
