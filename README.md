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
[`docs/product/sistema-de-pedidos/`](docs/product/sistema-de-pedidos/README.md).
A porta de entrada da documentação de produto é
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
git clone https://github.com/juunegreiros/ia-setec-2026.git
cd ia-setec-2026
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
git clone https://github.com/juunegreiros/ia-setec-2026.git
cd ia-setec-2026

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
  README.md                        # índice da documentação (comece aqui)
  product/                         # O QUE o sistema faz (fonte de verdade)
    business-rules.md              # contexto geral e índice dos projetos
    sistema-de-pedidos/            # regras, entidades, API e casos extremos
  architecture/                    # COMO o código é organizado + Linear via MCP
  workflow/                        # fluxo de desenvolvimento, skills e modos
  history/plans/, history/slices/  # planos e slices (ticket do Linear ou 1, 1.1)
  templates/                       # modelos de plano, slice e projeto
  plan.reference.md                # gabarito de slices do sistema de pedidos
.cursor/
  mcp.json                         # servidor MCP do Linear
  rules/code-quality.mdc           # regras que o agente sempre segue
  skills/                          # skills: /start-project, /execute-slice, …
prompts/                           # como rodar as skills num chat do navegador
```

O `health` existe para haver um exemplo pequeno e completo do padrão em cada
lado: `apps/api/apps/core` na API e `apps/web/src/features/health` no web. Os
slices imitam esses exemplos.

## Como o workshop usa este repositório

O workshop segue o fluxo de skills de
[`docs/workflow/development-flow.md`](docs/workflow/development-flow.md). Os
exemplos abaixo usam o **modo local** (sem Linear), que funciona para todo
mundo; com Linear, troque os números pelos IDs dos tickets.

1. **Leia antes de pedir código.** As regras de negócio e os padrões já estão
   escritos em `docs/`. O agente lê esses arquivos antes de qualquer coisa.
2. **Plano.** `/start-new-plan sistema-de-pedidos "Pedidos na API"`. O agente
   compara as regras com o código, tira dúvidas e grava
   `docs/history/plans/1-pedidos-na-api.md`, dividido em steps. Compare com o
   gabarito [`docs/plan.reference.md`](docs/plan.reference.md).
3. **Especificação.** `/create-slice 1 1` (um step) ou `/create-slices 1`
   (todos, com subagentes que só analisam). Cada slice ganha descrição,
   critérios de aceite e o prompt que será executado, em
   `docs/history/slices/1.1-….md`.
4. **Um slice por vez.** `/execute-slice 1.1`. O agente lê o contexto e executa
   o prompt do slice na própria conversa, roda os testes e registra a execução.
   Você lê o diff, faz `git add` e roda `/commit`.
5. **Retomar.** `/continue-plan 1` mostra o que foi feito, o que falta e o que
   não bate entre plano, slices e código.

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

## Usando como início de outros projetos

Além do sistema de pedidos, o repositório traz um fluxo completo para começar
um projeto seu com um agente de IA, com ou sem Linear. Sem Linear, tudo fica
em arquivos e os IDs são locais (plano `1`, slices `1.1`, `1.2`…); veja
[`docs/workflow/modes.md`](docs/workflow/modes.md).

| Skill | O que faz |
|-------|-----------|
| `/start-project <url do projeto no Linear \| nome>` | Entrevista você e documenta as regras de negócio em `docs/product/<projeto>/` |
| `/continue-project <url \| nome>` | Muda ou amplia as regras, mostrando o impacto antes |
| `/start-new-plan <url \| nome> "<título>"` | Compara regras e código e cria um plano em steps (ticket no Linear ou plano `1`) |
| `/continue-plan <GAM-12 \| 1>` | Resume o que foi feito e o que falta, aponta inconsistências e aplica mudanças |
| `/create-slice <GAM-12 \| 1> <step>` | Especifica um step sem deixar lacunas: descrição, critérios de aceite e prompt |
| `/create-slices <GAM-12 \| 1>` | Especifica todos os steps, com subagentes que só analisam |
| `/execute-slice <GAM-13 \| 1.1>` | Executa o prompt do slice na própria conversa, roda os testes e registra a execução |
| `/commit` | Faz o commit só do que já está staged, em Conventional Commits começando pelo ticket (`GAM-13 feat(api): …`) |

Toda skill termina com um **Output**: o que foi feito, os arquivos gravados, o
que ficou em aberto e o próximo comando.

O fluxo completo, etapa por etapa: [`docs/workflow/development-flow.md`](docs/workflow/development-flow.md).
Detalhes de cada skill: [`docs/workflow/skills.md`](docs/workflow/skills.md).

**Linear.** O agente acessa o Linear pelo servidor MCP configurado em
`.cursor/mcp.json`. No Cursor, confira em **Settings → MCP** que o servidor
`linear` está ligado; na primeira vez, ele abre o login no navegador e você
entra com a **sua** conta. Nenhum token fica no repositório. Mais em
[`docs/architecture/linear-mcp.md`](docs/architecture/linear-mcp.md).

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
