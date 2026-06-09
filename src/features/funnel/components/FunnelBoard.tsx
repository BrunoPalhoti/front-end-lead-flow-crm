import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useUpdateLead } from "@/features/leads/hooks/useUpdateLead";
import {
  FUNNEL_STAGES,
  LEAD_STAGE_LABELS,
  type Lead,
  type LeadStage,
} from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { getLeadSubtitle } from "@/utils/lead";

interface FunnelBoardProps {
  leads: Lead[];
}

export function FunnelBoard({ leads }: FunnelBoardProps) {
  const updateLead = useUpdateLead();

  function handleDragStart(event: React.DragEvent, leadId: string) {
    event.dataTransfer.setData("leadId", leadId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(event: React.DragEvent, stage: LeadStage) {
    event.preventDefault();
    const leadId = event.dataTransfer.getData("leadId");
    if (!leadId) return;

    const lead = leads.find((item) => item.id === leadId);
    if (!lead || lead.stage === stage) return;

    updateLead.mutate({ id: leadId, stage });
  }

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
        const stageLeads = leads.filter((lead) => lead.stage === stage);
        const totalValue = stageLeads.reduce(
          (sum, lead) => sum + (lead.value ?? 0),
          0,
        );

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
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                          noWrap
                        >
                          {lead.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {getLeadSubtitle(lead)}
                        </Typography>
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
