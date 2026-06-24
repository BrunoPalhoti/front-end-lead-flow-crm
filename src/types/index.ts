export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  cnpj?: string
  stage: LeadStage
  value?: number
  assignedToId?: string
  notes?: string
  role?: string
  origin?: string
  probability?: number
  expectedAt?: string
  tags?: string[]
  activities?: { title: string; date?: string; userInitials?: string }[]
  createdAt: string
  updatedAt: string
}

export interface CreateLeadPayload {
  name: string
  email: string
  phone?: string
  company?: string
  stage?: LeadStage
  value?: number
  assignedToId?: string
  notes?: string
  cnpj?: string
  role?: string
  origin?: string
  probability?: number
  expectedAt?: string
  tags?: string[]
  activities?: { title: string; date?: string; userInitials?: string }[]
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {
  id: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'seller' | 'manager'
}

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: 'Novo',
  contacted: 'Contato',
  qualified: 'Qualificado',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganho',
  lost: 'Perdido',
}

export const FUNNEL_STAGES: LeadStage[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
]
