import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { FUNNEL_STAGES } from "@/types";
import { LeadStatusChip } from "@/features/leads/components/LeadStatusChip";
import type { DashboardStats } from "@/features/dashboard/types/dashboardStats";

interface Props {
  stats: DashboardStats;
}

export function FunnelDistribution({ stats }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Distribuição por estágio
        </Typography>

        <Stack spacing={2}>
          {FUNNEL_STAGES.map((stage) => {
            const count = stats.byStage[stage];
            const percentage =
              stats.total > 0 ? (count / stats.total) * 100 : 0;

            return (
              <Box key={stage}>
                <Stack
                  direction="row"
                  sx={{
                    mb: 0.5,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <LeadStatusChip stage={stage} />
                  <Typography variant="body2" color="text.secondary">
                    {count} · {percentage.toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FunnelDistribution;
