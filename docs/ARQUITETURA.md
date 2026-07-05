# Arquitetura do Frontend — Lead Flow CRM

Documentação das convenções e da estrutura do projeto após a refatoração arquitetural.

## Visão geral

O projeto segue uma arquitetura **feature-based** com camadas compartilhadas:

```
src/
├── app/                 # Bootstrap da aplicação (rotas)
├── features/            # Módulos por domínio de negócio
├── shared/              # UI e hooks genéricos reutilizáveis
├── lib/                 # Infraestrutura (axios, mocks)
├── types/               # Tipos de domínio globais
├── utils/               # Funções puras sem React
├── schemas/             # Validação Zod
├── store/               # Estado global (Zustand)
└── theme/               # Tema MUI
```

---

## Estrutura de uma feature

Cada feature segue o mesmo padrão:

```
features/<nome>/
├── api/                 # Chamadas HTTP + query keys
│   ├── *.api.ts
│   └── queryKeys.ts
├── hooks/               # Somente React hooks
├── components/          # Componentes da feature
│   └── <Nome>/index.tsx
├── pages/               # Páginas de rota
├── types/               # Tipos de props/componentes (opcional)
└── utils/               # Utilitários específicos da feature (opcional)
```

### Features atuais

| Feature     | Responsabilidade                                      |
|-------------|-------------------------------------------------------|
| `auth`      | Login, registro, autenticação                         |
| `leads`     | Domínio central — CRUD e gestão de leads              |
| `dashboard` | Visão geral e estatísticas                            |
| `funnel`    | Board kanban do funil comercial                       |
| `users`     | Dados de usuários (consumido por leads)               |

---

## Convenções de pastas

### `api/` — camada de dados

- Contém **apenas** chamadas HTTP (`*.api.ts`) e **query keys** (`queryKeys.ts`).
- Não colocar APIs dentro de `hooks/` ou `services/`.
- Exemplo:

```ts
// features/leads/api/queryKeys.ts
export const LEADS_QUERY_KEY = ['leads'] as const

// features/leads/api/leads.api.ts
export const leadsApi = { getAll, getById, create, update, delete }
```

### `hooks/` — lógica React

Tipos de hooks e quando usar cada um:

| Tipo            | Exemplo               | Quando usar                              |
|-----------------|-----------------------|------------------------------------------|
| Query           | `useLeads`            | Buscar dados com React Query             |
| Mutation        | `useCreateLead`       | Criar/atualizar/deletar                  |
| Domain action   | `useLeadActions`      | Regras de negócio sobre mutations        |
| Derived data    | `useLeadTagOptions`   | Dado derivado de outra query             |
| Page            | `useLeadsPage`        | Orquestração de estado de uma página     |
| UI controller   | `useLeadEditor`       | Lógica de um fluxo de UI específico      |
| Genérico        | `useFeedbackSnack`    | Em `shared/hooks/` se for cross-feature  |

### `shared/` — código reutilizável

```
shared/
├── components/     # FeedbackAlert, AsyncPage, PageHeader, etc.
├── hooks/          # useFeedbackSnack
└── layouts/        # MainLayout, AuthLayout
```

### `utils/` — funções puras

- `utils/lead.ts` — helpers de lead usados em várias features (subtitle, iniciais, tags, agregações).
- `features/leads/utils/` — apenas lógica específica de formulário (`leadForm.ts`, `leadMappers.ts`).

### `app/router/` — rotas

Toda configuração de rotas fica centralizada:

```
app/router/
├── AppRouter.tsx
├── ProtectedRoute.tsx
└── index.ts
```

---

## Dependências entre features

```
dashboard ──► leads (hooks, componentes)
funnel    ──► leads (hooks, componentes)
leads     ──► users (useUsers)
```

`leads` é o **domínio central**. Features de visualização (`dashboard`, `funnel`) consomem seus hooks e componentes.

---

## Componentes compartilhados de lead

| Componente        | Localização                              | Uso                          |
|-------------------|------------------------------------------|------------------------------|
| `LeadStatusChip`  | `features/leads/components/`             | Badge de estágio             |
| `LeadSummary`     | `features/leads/components/`             | Nome + subtítulo do lead     |
| `FeedbackAlert`   | `shared/components/`                     | Snackbar de sucesso/erro     |
| `AsyncPage`       | `shared/components/`                     | Wrapper de loading           |

---

## Padrões de hooks

### Mutations com invalidação

```ts
// useUpdateLead invalida lista e item individual
onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY })
  queryClient.invalidateQueries({ queryKey: [...LEADS_QUERY_KEY, variables.id] })
}
```

### Actions de domínio

`useLeadActions` **não** chama a API diretamente — delega para `useUpdateLead`:

```ts
const updateLead = useUpdateLead()
await updateLead.mutateAsync(payload)
```

### Auth genérico

```ts
// useAuthMutation — base reutilizável
export function useLogin() {
  return useAuthMutation(authApi.login)
}
```

### Formulário inline com sincronização

`useLeadForm` usa estado derivado (sem `useEffect`):
- Em modo leitura: form espelha o `lead` atual.
- Em modo edição: usa `draft` local até salvar ou cancelar.

---

## O que foi removido (legado)

As seguintes pastas duplicadas na raiz de `src/` foram **eliminadas**:

| Pasta removida    | Substituída por                          |
|-------------------|------------------------------------------|
| `src/hooks/`      | `features/*/hooks/`                      |
| `src/api/`        | `features/*/api/` + `lib/`               |
| `src/components/` | `shared/components/` + `features/*/components/` |
| `src/layouts/`    | `shared/layouts/`                        |
| `src/routes/`     | `app/router/`                          |
| `src/lib/router/` | `app/router/`                          |

Outras mudanças:

- `services/` → `api/` em todas as features
- `leads.api.ts` movido de `hooks/` para `api/`
- `leadPayload.ts` renomeado para `leadMappers.ts`
- `useLeadDetailPanel` renomeado para `useLeadEditor`
- `useFunnelPage` removido (wrapper sem valor — `FunnelPage` usa `useLeads` diretamente)
- `saveLead` removido de `useLeadActions` (não utilizado)

---

## Imports recomendados

```ts
// Rotas
import { AppRouter } from '@/app/router'

// Dados
import { useLeads } from '@/features/leads/hooks/useLeads'
import { LEADS_QUERY_KEY } from '@/features/leads/api/queryKeys'
import { leadsApi } from '@/features/leads/api/leads.api'

// UI compartilhada
import { FeedbackAlert } from '@/shared/components/FeedbackAlert'
import { AsyncPage } from '@/shared/components/AsyncPage'
import { useFeedbackSnack } from '@/shared/hooks/useFeedbackSnack'

// Utilitários puros
import { getLeadSubtitle, sumLeadValues } from '@/utils/lead'
import { formValuesToCreatePayload } from '@/features/leads/utils/leadMappers'
```

---

## Checklist para novas features

1. Criar pasta em `features/<nome>/` com `api/`, `hooks/`, `components/`, `pages/`.
2. APIs em `api/*.api.ts`, nunca em `hooks/`.
3. Query keys em `api/queryKeys.ts`.
4. Componentes com `index.tsx` (sem `ComponentName.tsx` separado).
5. Lógica de página em hook `use<Nome>Page`.
6. Código genérico vai para `shared/`, não duplicar entre features.
7. Funções puras cross-feature em `src/utils/`.

---

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # tsc + vite build
npm run lint     # ESLint
```
