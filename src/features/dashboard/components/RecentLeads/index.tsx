import { Card, CardContent, Stack, Typography } from "@mui/material";
import { LeadStatusChip } from "@/features/leads/components/LeadStatusChip";
import { LeadSummary } from "@/features/leads/components/LeadSummary";
import type { RecentLeadsProps } from "@/features/dashboard/types/componentTypes";

export function RecentLeads({ leads }: RecentLeadsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leads recentes
        </Typography>

        <Stack spacing={1.5}>
          {leads.slice(0, 5).map((lead) => (
            <Stack
              key={lead.id}
              direction="row"
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.default",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <LeadSummary lead={lead} />
              <LeadStatusChip stage={lead.stage} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RecentLeads;
