import { useMemo } from 'react'
import { useLeads } from '@/hooks/useLeads'
import type { DashboardStats } from '@/pages/dashboard/types/dashboardStats'
import { FUNNEL_STAGES, type LeadStage } from '@/types'

/**
 * Agrega métricas do funil comercial para o dashboard:
 * totais, valores em pipeline/receita e distribuição por estágio.
 */
export function useDashboardStats() {
  const { data: leads = [], isLoading } = useLeads()

  const stats = useMemo((): DashboardStats => {
    const total = leads.length

    // Leads fechados com sucesso — base da receita ganha e da taxa de conversão
    const won = leads.filter((lead) => lead.stage === 'won')

    // Leads ainda em negociação (exclui ganhos e perdidos)
    const pipeline = leads.filter(
      (lead) => lead.stage !== 'won' && lead.stage !== 'lost',
    )

    const pipelineValue = pipeline.reduce((sum, lead) => sum + (lead.value ?? 0), 0)
    const wonValue = won.reduce((sum, lead) => sum + (lead.value ?? 0), 0)

    // Percentual de leads convertidos em relação ao total cadastrado
    const conversionRate = total > 0 ? (won.length / total) * 100 : 0

    // Contagem por estágio do funil para o gráfico de distribuição
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
