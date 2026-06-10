import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Grid, useTheme } from "@mui/material";
import { StatCard } from "@/shared/components/StatCard";
import type { DashboardStats } from "@/features/dashboard/types/dashboardStats";

interface Props {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: Props) {
  const theme = useTheme();

  return (
    <>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Total de leads"
          value={String(stats.total)}
          subtitle="Cadastrados no CRM"
          icon={<PeopleAltOutlinedIcon />}
          color={theme.palette.primary.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Pipeline"
          value={String(
            stats.pipelineValue ? Math.round(stats.pipelineValue) : "—",
          )}
          subtitle="Valor em negociação"
          icon={<AttachMoneyOutlinedIcon />}
          color={theme.palette.secondary.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Receita ganha"
          value={String(stats.wonValue ? Math.round(stats.wonValue) : "—")}
          subtitle="Leads convertidos"
          icon={<EmojiEventsOutlinedIcon />}
          color={theme.palette.success.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Conversão"
          value={`${stats.conversionRate.toFixed(1)}%`}
          subtitle="Taxa de fechamento"
          icon={<TrendingUpOutlinedIcon />}
          color={theme.palette.warning.main}
        />
      </Grid>
    </>
  );
}

export default DashboardStats;
