import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useMemo } from 'react'
import { LeadStatusChip } from '@/components/leads/LeadStatusChip'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageLoader } from '@/components/ui/PageLoader'
import { StatCard } from '@/components/ui/StatCard'
import { useLeads } from '@/hooks/useLeads'
import { FUNNEL_STAGES, type LeadStage } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'
import { getLeadSubtitle } from '@/utils/lead'

export function DashboardPage() {
  const theme = useTheme()
  const { data: leads = [], isLoading } = useLeads()

  const stats = useMemo(() => {
    const total = leads.length
    const won = leads.filter((lead) => lead.stage === 'won')
    const pipeline = leads.filter(
      (lead) => lead.stage !== 'won' && lead.stage !== 'lost',
    )
    const pipelineValue = pipeline.reduce((sum, lead) => sum + (lead.value ?? 0), 0)
    const wonValue = won.reduce((sum, lead) => sum + (lead.value ?? 0), 0)
    const conversionRate = total > 0 ? (won.length / total) * 100 : 0

    const byStage = FUNNEL_STAGES.reduce<Record<LeadStage, number>>(
      (acc, stage) => {
        acc[stage] = leads.filter((lead) => lead.stage === stage).length
        return acc
      },
      {} as Record<LeadStage, number>,
    )

    return { total, pipelineValue, wonValue, conversionRate, byStage }
  }, [leads])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Dashboard" subtitle="Visão geral do funil comercial" />

      <Grid container spacing={2}>
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
            value={formatCurrency(stats.pipelineValue, { maximumFractionDigits: 0 }) ?? '—'}
            subtitle="Valor em negociação"
            icon={<AttachMoneyOutlinedIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Receita ganha"
            value={formatCurrency(stats.wonValue, { maximumFractionDigits: 0 }) ?? '—'}
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
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Distribuição por estágio
          </Typography>

          <Stack spacing={2}>
            {FUNNEL_STAGES.map((stage) => {
              const count = stats.byStage[stage]
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

              return (
                <Box key={stage}>
                  <Stack
                    direction="row"
                    sx={{
                      mb: 0.5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
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
              )
            })}
          </Stack>
        </CardContent>
      </Card>

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
                  bgcolor: 'background.default',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {lead.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getLeadSubtitle(lead)}
                  </Typography>
                </Box>
                <LeadStatusChip stage={lead.stage} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
