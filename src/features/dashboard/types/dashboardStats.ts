import type { LeadStage } from '@/types'

export interface DashboardStats {
  total: number
  pipelineValue: number
  wonValue: number
  conversionRate: number
  byStage: Record<LeadStage, number>
}
