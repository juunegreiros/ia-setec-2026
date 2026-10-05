# Prompts para quem só tem chat no navegador

Se você não tem um agente com acesso aos arquivos (Cursor, Copilot no modo
agente, Antigravity…), dá para acompanhar o workshop com qualquer chat de IA
gratuito (ChatGPT, Gemini, Claude). Os prompts aqui são os mesmos das skills em
`.cursor/skills/`, adaptados para copiar e colar.

A diferença: no chat, **você** faz o papel das ferramentas do agente. Você cola
os arquivos que ele precisa ler e copia de volta o código que ele devolver.

## Arquivos

| Arquivo | Quando usar |
|---------|-------------|
| [`01-plan.md`](01-plan.md) | Uma vez, no começo: gera o plano a partir das regras de negócio |
| [`02-execute-slice.md`](02-execute-slice.md) | Uma vez por slice (1.1, 1.2, 2.1…) |
| [`03-orchestrate-issue.md`](03-orchestrate-issue.md) | Para ver o conceito de orchestrator no chat: ele escreve as instruções e você abre uma conversa nova para cada uma |

## Passo a passo de um slice no chat

1. Abra uma **conversa nova** (uma por slice: contexto limpo).
2. Cole o conteúdo de `02-execute-slice.md` e troque `<X.Y>` pelo id do slice.
3. Logo abaixo, cole, nesta ordem:
   - `docs/product/business-rules.md`
   - `docs/architecture/project-standards.md`
   - o trecho do slice em `docs/plan.md` (ou `docs/plan.reference.md`)
   - o conteúdo atual de cada arquivo que o slice vai alterar
     (ex.: `apps/api/config/settings.py`)
4. Leia a resposta antes de copiar. Ela traz cada arquivo completo, com o
   caminho.
5. Crie ou substitua os arquivos no seu editor.
6. Rode `make test` (ou os comandos do README). Se falhar, cole o **erro
   inteiro** de volta na mesma conversa.
7. Quando passar, faça o commit.

## Ficou para trás?

```bash
git fetch
git checkout final
```

A branch `final` tem o projeto pronto. Siga assistindo e volte para o seu
código depois.
