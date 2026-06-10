import { Grid, Stack } from "@mui/material";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageLoader } from "@/shared/components/PageLoader";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { FunnelDistribution } from "@/features/dashboard/components/FunnelDistribution";
import { RecentLeads } from "@/features/dashboard/components/RecentLeads";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

export function DashboardPage() {
  const { stats, leads, isLoading } = useDashboardStats();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Dashboard" subtitle="Visão geral do funil comercial" />

      <Grid container spacing={2}>
        <DashboardStats stats={stats} />
      </Grid>

      <FunnelDistribution stats={stats} />

      <RecentLeads leads={leads} />
    </Stack>
  );
}
