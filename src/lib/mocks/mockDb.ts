import type { Lead, User } from '@/types'
import { delay } from '@/utils/delay'

const STORAGE_KEY = 'leadflow-crm-mock-db'
const MOCK_DB_VERSION = 'v2'

interface MockDatabase {
  leads: Lead[]
  users: User[]
}

const seedUsers: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@leadflow.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno@leadflow.com',
    role: 'seller',
  },
  {
    id: '3',
    name: 'Carla Mendes',
    email: 'carla@leadflow.com',
    role: 'manager',
  },
]

const seedLeads: Lead[] = [
  {
    id: '1',
    name: 'TechNova Ltda',
    email: 'contato@technova.com',
    phone: '(11) 98765-4321',
    company: 'TechNova',
    stage: 'qualified',
    value: 15000,
    assignedToId: '2',
    notes: 'Interessados no plano enterprise',
    cnpj: '12.345.678/0001-90',
    role: 'Diretor Comercial',
    origin: 'Indicação',
    probability: 60,
    expectedAt: '2026-07-30T00:00:00.000Z',
    tags: ['Enterprise', 'Tecnologia'],
    activities: [
      { title: 'Ligação realizada', date: '2026-06-01T14:00:00.000Z', userInitials: 'BC' },
      { title: 'E-mail enviado', date: '2026-05-28T09:30:00.000Z', userInitials: 'BC' }
    ],
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-06-01T14:30:00.000Z',
  },
  {
    id: '2',
    name: 'GreenFood SA',
    email: 'compras@greenfood.com',
    phone: '(21) 91234-5678',
    company: 'GreenFood',
    stage: 'proposal',
    value: 8500,
    assignedToId: '2',
    cnpj: '98.765.432/0001-10',
    role: 'Comprador',
    origin: 'Site',
    probability: 40,
    expectedAt: '2026-07-10T00:00:00.000Z',
    tags: ['Alimentos'],
    activities: [{ title: 'Proposta enviada', date: '2026-06-02T10:45:00.000Z', userInitials: 'BC' }],
    createdAt: '2026-05-10T09:00:00.000Z',
    updatedAt: '2026-06-02T11:00:00.000Z',
  },
  {
    id: '3',
    name: 'LogiTrans',
    email: 'vendas@logitrans.com',
    company: 'LogiTrans',
    stage: 'new',
    value: 22000,
    assignedToId: '3',
    cnpj: '11.222.333/0001-44',
    role: 'CEO',
    origin: 'Feira',
    probability: 20,
    expectedAt: '2026-08-01T00:00:00.000Z',
    tags: ['Logística'],
    activities: [],
    createdAt: '2026-06-03T08:00:00.000Z',
    updatedAt: '2026-06-03T08:00:00.000Z',
  },
  {
    id: '4',
    name: 'Studio Criativo',
    email: 'hello@studiocriativo.com',
    phone: '(31) 99876-5432',
    company: 'Studio Criativo',
    stage: 'negotiation',
    value: 5200,
    assignedToId: '3',
    cnpj: '22.333.444/0001-55',
    role: 'Proprietário',
    origin: 'Indicação',
    probability: 50,
    expectedAt: '2026-06-25T00:00:00.000Z',
    tags: ['Design'],
    activities: [{ title: 'Reunião agendada', date: '2026-06-04T10:00:00.000Z', userInitials: 'CM' }],
    createdAt: '2026-05-20T16:00:00.000Z',
    updatedAt: '2026-06-04T10:15:00.000Z',
  },
  {
    id: '5',
    name: 'FinBank Corp',
    email: 'parcerias@finbank.com',
    company: 'FinBank',
    stage: 'won',
    value: 45000,
    assignedToId: '2',
    cnpj: '33.444.555/0001-66',
    role: 'Gerente de Parcerias',
    origin: 'Campanha',
    probability: 100,
    expectedAt: '2026-05-30T00:00:00.000Z',
    tags: ['Financeiro'],
    activities: [{ title: 'Contrato assinado', date: '2026-05-28T16:00:00.000Z', userInitials: 'BC' }],
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-05-28T17:00:00.000Z',
  },
]

function loadDb(): MockDatabase {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (raw) {
    const parsed = JSON.parse(raw) as MockDatabase & { __mockVersion?: string }

    // se versão do mock mudou, sobrescreve com seeds atuais
    if (parsed.__mockVersion !== MOCK_DB_VERSION) {
      const db: MockDatabase & { __mockVersion?: string } = { leads: seedLeads, users: seedUsers, __mockVersion: MOCK_DB_VERSION }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
      return { leads: seedLeads, users: seedUsers }
    }

    // normalizar leads existentes preenchendo campos novos quando ausentes
    const normalizedLeads = parsed.leads.map((lead: Lead) => ({
      cnpj: undefined,
      role: undefined,
      origin: undefined,
      probability: undefined,
      expectedAt: undefined,
      tags: [],
      activities: [],
      ...lead,
    }))

    const normalized: MockDatabase = { users: parsed.users, leads: normalizedLeads }
    // salvar de volta normalizado para evitar inconsistência no próximo carregamento
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...normalized, __mockVersion: MOCK_DB_VERSION }))
    return normalized
  }

    const db: MockDatabase & { __mockVersion?: string } = { leads: seedLeads, users: seedUsers, __mockVersion: MOCK_DB_VERSION }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  return { leads: seedLeads, users: seedUsers }
}

function saveDb(db: MockDatabase): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export const mockDb = {
  async getLeads(): Promise<Lead[]> {
    await delay()
    return [...loadDb().leads]
  },

  async getLead(id: string): Promise<Lead | undefined> {
    await delay()
    return loadDb().leads.find((lead) => lead.id === id)
  },

  async createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    await delay()
    const db = loadDb()
    const now = new Date().toISOString()
    const lead: Lead = {
      ...data,
      tags: data.tags ?? [],
      activities: data.activities ?? [],
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    db.leads.unshift(lead)
    saveDb(db)
    return lead
  },

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    await delay()
    const db = loadDb()
    const index = db.leads.findIndex((lead) => lead.id === id)

    if (index === -1) {
      throw new Error('Lead não encontrado')
    }

    const updated: Lead = {
      ...db.leads[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    }
    db.leads[index] = updated
    saveDb(db)
    return updated
  },

  async deleteLead(id: string): Promise<void> {
    await delay()
    const db = loadDb()
    db.leads = db.leads.filter((lead) => lead.id !== id)
    saveDb(db)
  },

  async getUsers(): Promise<User[]> {
    await delay()
    return [...loadDb().users]
  },
}

export const isMockMode = import.meta.env.VITE_USE_MOCK === 'true'
