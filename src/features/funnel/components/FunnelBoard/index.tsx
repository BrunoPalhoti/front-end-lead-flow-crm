import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useFunnelDragDrop } from "@/features/funnel/hooks/useFunnelDragDrop";
import { LeadSummary } from "@/features/leads/components/LeadSummary";
import {
  FUNNEL_STAGES,
  LEAD_STAGE_LABELS,
  type Lead,
} from "@/types";
import { filterLeadsByStage, sumLeadValues } from "@/utils/lead";
import { formatCurrency } from "@/utils/formatCurrency";

interface FunnelBoardProps {
  leads: Lead[];
}

export function FunnelBoard({ leads }: FunnelBoardProps) {
  const { handleDragStart, handleDrop } = useFunnelDragDrop(leads);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(7, 1fr)",
        },
        gap: 2,
        alignItems: "start",
      }}
    >
      {FUNNEL_STAGES.map((stage) => {
        const stageLeads = filterLeadsByStage(leads, stage);
        const totalValue = sumLeadValues(stageLeads);

        return (
          <Box
            key={stage}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, stage)}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 1.5,
              minHeight: 320,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {LEAD_STAGE_LABELS[stage]}
                </Typography>
                <Chip label={stageLeads.length} size="small" />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {formatCurrency(totalValue, { fallback: "R$ 0,00" })}
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {stageLeads.map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, lead.id)}
                  sx={{
                    cursor: "grab",
                    "&:active": { cursor: "grabbing" },
                  }}
                >
                  <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "flex-start" }}
                    >
                      <DragIndicatorIcon
                        fontSize="small"
                        sx={{ color: "text.disabled", mt: 0.25 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <LeadSummary lead={lead} noWrap />
                        {lead.value != null && (
                          <Typography
                            variant="caption"
                            color="primary.main"
                            sx={{ mt: 0.5, display: "block", fontWeight: 600 }}
                          >
                            {formatCurrency(lead.value)}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}

export default FunnelBoard;
