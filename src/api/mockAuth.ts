import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import { delay } from '@/utils/delay'

const AUTH_STORAGE_KEY = 'leadflow-crm-auth-accounts'

interface AuthAccount {
  id: string
  name: string
  email: string
  password: string
}

const seedAccounts: AuthAccount[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@leadflow.com',
    password: '123456',
  },
]

function loadAccounts(): AuthAccount[] {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)

  if (raw) {
    return JSON.parse(raw) as AuthAccount[]
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(seedAccounts))
  return seedAccounts
}

function saveAccounts(accounts: AuthAccount[]): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accounts))
}

function createToken(userId: string): string {
  return `mock-token-${userId}-${Date.now()}`
}

function toAuthResponse(account: AuthAccount): AuthResponse {
  return {
    token: createToken(account.id),
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
    },
  }
}

export const mockAuth = {
  async login({ email, password }: LoginPayload): Promise<AuthResponse> {
    await delay(400)
    const accounts = loadAccounts()
    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    )

    if (!account) {
      throw new Error('E-mail ou senha inválidos')
    }

    return toAuthResponse(account)
  },

  async register({ name, email, password }: RegisterPayload): Promise<AuthResponse> {
    await delay(400)
    const accounts = loadAccounts()
    const exists = accounts.some(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    )

    if (exists) {
      throw new Error('Este e-mail já está cadastrado')
    }

    const account: AuthAccount = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    }

    accounts.push(account)
    saveAccounts(accounts)
    return toAuthResponse(account)
  },
}
