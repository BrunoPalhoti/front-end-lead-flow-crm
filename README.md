# Lead Flow CRM

Aplicação front-end de CRM para gestão de leads comerciais. Permite acompanhar o funil de vendas, cadastrar e editar leads, e visualizar métricas em um dashboard — tudo com interface moderna e responsiva.

## Stack

| Tecnologia                                                                | Uso                       |
| ------------------------------------------------------------------------- | ------------------------- |
| [React 19](https://react.dev/)                                            | Interface                 |
| [TypeScript](https://www.typescriptlang.org/)                             | Tipagem estática          |
| [Vite](https://vite.dev/)                                                 | Build e dev server        |
| [Material UI](https://mui.com/)                                           | Componentes e tema        |
| [MUI X Data Grid](https://mui.com/x/react-data-grid/)                     | Tabela de leads           |
| [React Router](https://reactrouter.com/)                                  | Roteamento                |
| [TanStack Query](https://tanstack.com/query)                              | Cache e requisições       |
| [Zustand](https://zustand.docs.pmnd.rs/)                                  | Estado global (auth e UI) |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Formulários e validação   |
| [Axios](https://axios-http.com/)                                          | Cliente HTTP              |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm, yarn ou pnpm

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd front-end-lead-flow-crm

# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Acesso de demonstração

No modo mock, use as credenciais abaixo ou crie uma conta em **Cadastro**:

| E-mail             | Senha    |
| ------------------ | -------- |
| `ana@leadflow.com` | `123456` |

## Scripts disponíveis

| Comando           | Descrição                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia o servidor de desenvolvimento |
| `npm run build`   | Gera o build de produção             |
| `npm run preview` | Visualiza o build localmente         |
| `npm run lint`    | Executa o ESLint                     |

## Rotas

| Rota        | Acesso      | Descrição                |
| ----------- | ----------- | ------------------------ |
| `/login`    | Público     | Página de login          |
| `/cadastro` | Público     | Página de cadastro       |
| `/`         | Autenticado | Dashboard                |
| `/leads`    | Autenticado | Gestão de leads          |
| `/funnel`   | Autenticado | Funil comercial (Kanban) |

## Estágios do funil

Os leads passam pelos seguintes estágios:

`Novo` → `Contato` → `Qualificado` → `Proposta` → `Negociação` → `Ganho` / `Perdido`

## Estrutura do projeto

```
src/
├── api/              # Cliente HTTP, mocks e endpoints
├── components/       # Componentes reutilizáveis (UI, auth, layout, forms)
├── hooks/            # Hooks customizados (leads, auth, users)
├── layouts/          # Layouts de autenticação e área logada
├── pages/            # Páginas da aplicação
│   ├── dashboard/
│   ├── funnel/
│   ├── leads/
│   ├── login/
│   └── register/
├── routes/           # Configuração de rotas e guards
├── schemas/          # Schemas Zod para validação
├── store/            # Stores Zustand (auth, UI)
├── theme/            # Tema Material UI
├── types/            # Tipos TypeScript
└── utils/            # Funções utilitárias
```

## API (modo produção)

Com `VITE_USE_MOCK=false`, a aplicação espera os seguintes endpoints:

| Método   | Endpoint         | Descrição                      |
| -------- | ---------------- | ------------------------------ |
| `POST`   | `/auth/login`    | Login                          |
| `POST`   | `/auth/register` | Cadastro                       |
| `GET`    | `/leads`         | Listar leads                   |
| `GET`    | `/leads/:id`     | Buscar lead                    |
| `POST`   | `/leads`         | Criar lead                     |
| `PATCH`  | `/leads/:id`     | Atualizar lead                 |
| `DELETE` | `/leads/:id`     | Remover lead                   |
| `GET`    | `/users`         | Listar usuários (responsáveis) |

As requisições autenticadas enviam o token JWT no header `Authorization: Bearer <token>`.

## Licença

Projeto privado.
