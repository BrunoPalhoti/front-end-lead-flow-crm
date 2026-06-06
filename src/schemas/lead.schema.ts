import { z } from 'zod'
import { FUNNEL_STAGES, type LeadStage } from '@/types'

const leadStages = FUNNEL_STAGES as [LeadStage, ...LeadStage[]]

export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  stage: z.enum(leadStages),
  value: z.number().min(0, 'Valor deve ser positivo').optional(),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
