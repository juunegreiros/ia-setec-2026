# Sistema de pedidos — projeto do workshop

Repositório de exemplo do workshop **Agentes de IA no desenvolvimento de
software**. Durante o workshop, um pequeno sistema de pedidos é construído ao
vivo, slice por slice, com um agente de IA. Você acompanha no seu próprio clone.

Este repositório começa **só com a fundação**: estrutura, documentação, regras
para o agente e skills. Produtos e pedidos ainda não existem; eles são o que a
gente constrói juntos.

## O que o sistema vai fazer

Produtos são cadastrados no Django Admin. O app web lista os produtos ativos,
deixa a pessoa escolher a quantidade de cada um, mostra o total, pede o nome e
envia. A API valida e grava o pedido.

As regras completas, com os casos extremos, estão em
[`docs/product/business-rules.md`](docs/product/business-rules.md).

## Stack

| Parte | Tecnologias |
|-------|-------------|
| API (`apps/api`) | Python, Django 5.2, Django REST Framework, Django Admin, SQLite |
| Web (`apps/web`) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, React Query, Zod |
| Testes | Testes do Django (API) e Vitest + Testing Library (web) |

Sem Docker e sem servidor de banco: o banco é um arquivo SQLite criado pelo
setup.

## Pré-requisitos

Instale antes do workshop:

- [Git](https://git-scm.com/downloads)
- [Python](https://www.python.org/downloads/) **3.10 ou mais novo** (3.13
  recomendado). No macOS, o `python3` que vem com o sistema é o 3.9 e **não
  serve**: instale um mais novo pelo site.
- [Node.js](https://nodejs.org/) **20 ou mais novo** (o npm vem junto)
- Um editor: [Cursor](https://cursor.com/) (recomendado) ou
  [VS Code](https://code.visualstudio.com/) com GitHub Copilot
- `make`: já vem no macOS e no Linux. No Windows, não precisa: use os comandos
  equivalentes da tabela mais abaixo.

Confira as versões:

```bash
git --version
python3 --version   # Windows: py --version
node --version
```

## Começando (macOS e Linux)

```bash
git clone <url-do-repositorio> workshop-pedidos
cd workshop-pedidos
make setup
```

O `make setup` cria o `.env`, instala as dependências do Python e do Node, cria
o banco e um usuário do Admin (`admin` / `admin`, definidos no `.env`).

Depois, em **dois terminais** na raiz do repositório:

```bash
make api    # terminal 1 — API em http://localhost:8000
make web    # terminal 2 — app em http://localhost:3000
```

Abra http://localhost:3000. A seção **Status da API** deve mostrar **Online**.

Para rodar os testes:

```bash
make test
```

## Começando (Windows, sem make)

No PowerShell, na pasta do repositório:

```powershell
git clone <url-do-repositorio> workshop-pedidos
cd workshop-pedidos

copy .env.example .env

cd apps\api
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py ensure_admin

cd ..\web
npm install
cd ..\..
```

Não é preciso "ativar" o venv: os comandos chamam o Python de dentro dele
diretamente (`.venv\Scripts\python`). Se você tiver mais de um Python, escolha a
versão com `py -3.13 -m venv .venv`.

Depois, em dois terminais:

```powershell
# terminal 1
cd apps\api
.venv\Scripts\python manage.py runserver

# terminal 2
cd apps\web
npm run dev
```

## Comandos

Todos os comandos `make` rodam na **raiz** do repositório. A coluna da direita é
o equivalente sem `make`; no Windows, troque `.venv/bin/python` por
`.venv\Scripts\python`.

| Comando | O que faz | Sem make |
|---------|-----------|----------|
| `make help` | Lista os comandos | — |
| `make setup` | Primeira vez: `.env`, dependências, banco e usuário do Admin | Veja "Começando (Windows, sem make)" acima |
| `make api` | API em http://localhost:8000 | `cd apps/api && .venv/bin/python manage.py runserver` |
| `make web` | App em http://localhost:3000 | `cd apps/web && npm run dev` |
| `make test` | Todos os testes (API + web) | `cd apps/api && .venv/bin/python manage.py test` e depois `cd apps/web && npm test` |
| `make test-api` | Só os testes da API | `cd apps/api && .venv/bin/python manage.py test` |
| `make test-web` | Só os testes do web | `cd apps/web && npm test` |
| `make lint` | ESLint e TypeScript do web | `cd apps/web && npm run lint && npm run typecheck` |
| `make migrate` | Aplica as migrations | `cd apps/api && .venv/bin/python manage.py migrate` |
| `make admin` | Cria o usuário do Admin com os dados do `.env` | `cd apps/api && .venv/bin/python manage.py ensure_admin` |
| `make superuser` | Cria outro usuário do Admin (interativo) | `cd apps/api && .venv/bin/python manage.py createsuperuser` |

Depois de um slice que cria models, gere a migration com:

```bash
cd apps/api && .venv/bin/python manage.py makemigrations
```

## Endereços locais

| O quê | Endereço |
|-------|----------|
| App web | http://localhost:3000 |
| API | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin/ (`admin` / `admin`) |
| Health check | http://localhost:8000/api/health/ |

Resposta esperada do health check:

```json
{"status":"ok","service":"workshop-pedidos-api"}
```

## Estrutura

```
apps/
  api/                    # Django: API REST + Admin
    config/               # settings e urls
    apps/core/            # GET /api/health/ e o comando ensure_admin
  web/                    # Next.js
    src/app/              # páginas (a home consulta o health check)
    src/components/       # ui/ (botão, badge) e layout/ (estrutura da página)
    src/features/health/  # exemplo completo do padrão: api/ + components/
    src/lib/              # cliente HTTP, env, React Query, schemas Zod
docs/
  product/business-rules.md        # O QUE o sistema faz (fonte de verdade)
  architecture/project-standards.md # COMO o código é organizado
  plan.reference.md                # plano de referência, slice por slice
.cursor/
  rules/code-quality.mdc           # regras que o agente sempre segue
  skills/execute-slice/            # /execute-slice 1.1 — executa um slice
  skills/orchestrate-issue/        # /orchestrate-issue 3 — subagentes por slice
prompts/                           # os mesmos prompts, para quem só tem chat
```

O `health` existe para haver um exemplo pequeno e completo do padrão em cada
lado: `apps/api/apps/core` na API e `apps/web/src/features/health` no web. Os
slices imitam esses exemplos.

## Como o workshop usa este repositório

1. **Leia antes de pedir código.** As regras de negócio e os padrões já estão
   escritos em `docs/`. O agente lê esses arquivos antes de qualquer coisa.
2. **Plano.** No modo Plan do Cursor, o agente gera `docs/plan.md` a partir das
   regras, usando o prompt de [`prompts/01-plan.md`](prompts/01-plan.md). Se
   algo der errado, [`docs/plan.reference.md`](docs/plan.reference.md) é o plano
   pronto.
3. **Um slice por vez.** `/execute-slice 1.1` no chat do agente. Ele implementa
   só aquele slice, roda os testes e reporta. Você lê o diff e faz o commit.
4. **Orchestrator.** `/orchestrate-issue 3` executa os três slices do app web,
   cada um num subagente que não vê a conversa principal; só o relatório volta.

### Acompanhando com outra ferramenta

- **Agente com acesso aos arquivos** (Cursor, Copilot no modo agente,
  Antigravity…): use os mesmos comandos. No Copilot, peça "siga
  `.cursor/skills/execute-slice/SKILL.md` com o slice 1.1".
- **Só chat no navegador** (ChatGPT, Gemini, Claude): siga
  [`prompts/README.md`](prompts/README.md).

### Ficou para trás?

```bash
git stash        # guarda o que você fez, se quiser voltar depois
git checkout final
```

A branch `final` tem o projeto completo, resultado do ensaio do workshop.

## Problemas comuns

**`Precisa de Python 3.10 ou mais novo`** — o setup encontrou um Python antigo.
Instale o 3.13 pelo [python.org](https://www.python.org/downloads/) e rode
`make setup` de novo. Para apontar um Python específico:
`make setup PYTHON_BIN=/caminho/para/python3.13`.

**Trocou de Python depois do setup** — apague `apps/api/.venv` e rode
`make setup` de novo.

**Status da API "Indisponível" no app** — a API não está rodando. Abra outro
terminal e rode `make api`.

**Porta em uso (`port 8000` ou `3000 is already in use`)** — outro processo está
usando a porta. Feche o terminal antigo do `make api` / `make web` ou reinicie o
computador.

**`npm` não encontrado** — o Node.js não está instalado ou o terminal foi aberto
antes da instalação. Instale o Node 20+ e abra um terminal novo.
