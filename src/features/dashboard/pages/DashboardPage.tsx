import { Grid, Stack } from "@mui/material";
import { PageHeader } from "@/shared/components/PageHeader";
import { AsyncPage } from "@/shared/components/AsyncPage";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { FunnelDistribution } from "@/features/dashboard/components/FunnelDistribution";
import { RecentLeads } from "@/features/dashboard/components/RecentLeads";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

export function DashboardPage() {
  const { stats, leads, isLoading } = useDashboardStats();

  return (
    <AsyncPage isLoading={isLoading}>
      <Stack spacing={3}>
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral do funil comercial"
        />

        <Grid container spacing={2}>
          <DashboardStats stats={stats} />
        </Grid>

        <FunnelDistribution stats={stats} />

        <RecentLeads leads={leads} />
      </Stack>
    </AsyncPage>
  );
}
