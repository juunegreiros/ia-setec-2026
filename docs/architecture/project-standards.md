# Padrões do projeto

Este documento diz **como** o código é organizado. As regras de negócio (o
**quê**) estão em [`../product/business-rules.md`](../product/business-rules.md).

## Estrutura de pastas (monorepo)

```
workshop-pedidos/
  apps/
    api/          # Django — API REST + Django Admin
    web/          # Next.js — app que o cliente usa
  docs/
    architecture/ # como o código é organizado (este arquivo)
    product/      # regras de negócio
    plan.md       # plano gerado ao vivo (não existe até o workshop)
    plan.reference.md  # plano de referência, usado se plan.md não existir
  prompts/        # os mesmos prompts das skills, para quem só tem chat no navegador
  .cursor/
    rules/        # regras que o agente sempre segue
    skills/       # skills: prompts com nome, chamados com /nome-da-skill
  Makefile
  .env.example
```

## Separação `apps/web` e `apps/api`

| Responsabilidade | Onde |
|------------------|------|
| Tela, interação, estado do formulário | `apps/web` |
| Persistência, regras de negócio, validação final, Admin | `apps/api` |
| Contrato entre os dois | API REST em JSON, sob `/api/` |

- O `apps/web` **nunca** acessa o banco diretamente. Tudo passa pela API.
- A API é a fonte de verdade. O web pode validar para dar feedback rápido, mas a
  API valida de novo e decide. Exemplo: o total mostrado na tela é só uma
  prévia; o total gravado é o que a API calcula.

## Nomenclatura

- **Arquivos e pastas no web**: kebab-case (`health-status.tsx`, `fetch-health.ts`).
- **Componentes React**: PascalCase (`HealthStatus`).
- **Python / Django**: snake_case em módulos, funções e campos; apps Django com
  nomes curtos no plural do domínio (`products`, `orders`).
- **Endpoints**: prefixo `/api/`, recurso no plural, barra no final
  (`/api/products/`).
- **Código, identificadores, commits e skills**: em inglês.
- **README, docs e todo texto que aparece na tela**: em português do Brasil.

## Backend — organização por apps Django

```
apps/api/
  config/           # settings, urls raiz, wsgi/asgi
  apps/
    core/           # health check e comandos utilitários
    <domínio>/      # um app por domínio, criado quando o slice dele for executado
      models.py
      admin.py
      serializers.py
      views.py
      urls.py
      tests/
        test_<assunto>.py
```

- Um app Django por domínio de negócio (`products`, `orders`).
- Regras de negócio que envolvem mais de um model (ex.: calcular o total de um
  pedido) ficam no serializer ou em um `services.py` do app, nunca na view.
- Toda regra de negócio tem teste em `tests/`. Use `TestCase` quando o teste
  precisa de banco e `SimpleTestCase` quando não precisa.
- Dinheiro: `DecimalField(max_digits=10, decimal_places=2)`. Nunca `float`.
- Banco: SQLite (`apps/api/db.sqlite3`), para o setup não depender de Docker.

## Frontend — organização por features

```
apps/web/src/
  app/                    # rotas do App Router; page.tsx só compõe
  components/ui/          # componentes visuais reutilizáveis (button, status-badge)
  components/layout/      # estrutura de página (page-shell, site-header)
  features/<domínio>/
    api/                  # funções que chamam a API (fetch-*.ts) + testes
    components/           # componentes do domínio + testes
  lib/
    api/                  # cliente HTTP (apiFetch, ApiError)
    env/                  # leitura e validação de variáveis de ambiente
    query/                # React Query (client e provider)
    validation/           # schemas Zod das respostas da API
  styles/                 # CSS global e tokens do Tailwind
```

- `page.tsx` não tem lógica: importa componentes de `features/`.
- Toda resposta da API passa por um schema Zod em `lib/validation/` antes de ser
  usada. Se a API mudar o formato, o erro aparece na fronteira, não no meio da
  tela.
- Dados do servidor ficam no React Query (`useQuery`, `useMutation`). Estado do
  formulário fica no componente.
- Exemplo completo e pequeno do padrão: `features/health/`.

## Regra: não criar módulos de negócio antes do slice

Não crie os apps `products` ou `orders`, seus models, endpoints ou telas antes
de executar o slice correspondente do plano. Cada slice cria só o que ele
precisa. Isso evita migrations e telas que depois precisam ser desfeitas.

## Testes

| Lado | Ferramenta | Comando |
|------|------------|---------|
| API | `manage.py test` (unittest do Django) | `make test-api` |
| Web | Vitest + Testing Library | `make test-web` |
| Tudo | — | `make test` |

Um slice só está pronto quando `make test` passa e `make lint` está limpo.

## Documentação viva

Quando uma decisão técnica mudar, atualize este arquivo e o README na mesma
entrega.
