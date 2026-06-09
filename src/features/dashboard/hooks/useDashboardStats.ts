import { useMemo } from 'react'
import { useLeads } from '@/features/leads/hooks/useLeads'
import type { DashboardStats } from '@/features/dashboard/types/dashboardStats'
import { FUNNEL_STAGES, type LeadStage } from '@/types'

export function useDashboardStats() {
  const { data: leads = [], isLoading } = useLeads()

  const stats = useMemo((): DashboardStats => {
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

  return { stats, leads, isLoading }
}
