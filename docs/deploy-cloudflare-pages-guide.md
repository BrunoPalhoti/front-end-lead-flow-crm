# Guia rápido: Deploy automático para Cloudflare Pages

Este mini-guia mostra, passo a passo, como criar o API Token no Cloudflare, adicionar os secrets no GitHub e disparar o workflow que publicará o site da branch `main`.

Pré-requisitos
- Conta Cloudflare com acesso ao projeto Pages
- Permissão de administrador no repositório GitHub

1) Criar API Token no Cloudflare
- Acesse Cloudflare → seu avatar → **My Profile** → **API Tokens**.
- Clique em **Create Token**.
- Use o template **Edit Cloudflare Pages** ou crie um token customizado com permissão **Account:Pages - Edit**.
- Em **Account Resources** selecione sua conta (ou restrinja pelo Account ID).
- Dê um nome (ex.: `pages-deploy-token`) e copie o token (apenas será mostrado uma vez).

![Criar API Token](docs/screenshots/01-create-api-token.png)

2) Obter `Account ID` e `Project name`
- No painel Cloudflare → **Pages** → selecione o projeto do site.
- Em **Settings** / **General** copie o `Account ID` e o `Project name`.

![Account ID e Project name](docs/screenshots/02-account-project.png)

3) Adicionar secrets no GitHub
- Vá ao repositório no GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
- Crie estes secrets (nomes exatos):
  - `CLOUDFLARE_API_TOKEN` → valor: (token copiado)
  - `CLOUDFLARE_ACCOUNT_ID` → valor: (Account ID)
  - `CLOUDFLARE_PROJECT_NAME` → valor: (Project name)
- Salve cada secret.

![Adicionar Secrets no GitHub](docs/screenshots/03-add-secrets.png)

4) Verificar o workflow no repositório
- O workflow está em [/.github/workflows/deploy-cloudflare-pages.yml](.github/workflows/deploy-cloudflare-pages.yml#L1).
- Confirme que `directory` aponta para `./dist` (padrão do Vite) e que o gatilho é `push` na branch `main`.

5) Merge e disparo do Action
- Faça merge da sua branch para `main` (ou abra um PR). Após o push o workflow será executado automaticamente.

Comandos úteis:
```
git checkout main
git pull origin main
git merge refactor-architecture-folders
git push origin main
```

6) Logs e troubleshooting
- Abra a aba **Actions** no GitHub e selecione o workflow `Deploy to Cloudflare Pages` para ver os logs.
- Erros comuns:
  - Token com permissões insuficientes
  - `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_PROJECT_NAME` incorretos
  - Build que não gera `dist`

7) Capturar screenshots
- Recomendo capturar as telas indicadas e salvar em `docs/screenshots/` com os nomes sugeridos (por exemplo `01-create-api-token.png`).

Se quiser, eu posso:
- criar um PR da sua branch para `main`, ou
- gerar automaticamente os arquivos de screenshot de exemplo (imagens placeholders), ou
- criar um checklist com passos que você pode seguir enquanto captura as telas.

Fim do guia.
