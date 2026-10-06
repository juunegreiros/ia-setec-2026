# Prompts para quem só tem chat no navegador

Se você não tem um agente com acesso aos arquivos (Cursor, Copilot no modo
agente, Antigravity…), dá para acompanhar o workshop com qualquer chat de IA
gratuito (ChatGPT, Gemini, Claude). Você usa as mesmas skills de
`.cursor/skills/`, sempre no **modo local** (sem Linear, slices numerados
`1.1`, `1.2`…).

A diferença: no chat, **você** faz o papel das ferramentas do agente. Você cola
os arquivos que ele precisa ler, salva os arquivos que ele devolver e roda os
comandos.

## Arquivos

| Arquivo | Quando usar |
|---------|-------------|
| [`run-skill.md`](run-skill.md) | Para rodar qualquer skill: o prompt e a lista do que colar em cada uma |

## Passo a passo de um slice no chat

1. Abra uma **conversa nova** (uma por slice: contexto limpo).
2. Cole o prompt de `run-skill.md` com `<skill>` = `execute-slice` e
   `<entrada>` = o id do slice (ex.: `1.1`).
3. Logo abaixo, cole `.cursor/skills/execute-slice/SKILL.md`, a spec do slice
   (`docs/history/slices/1.1-*.md`) e os arquivos que o prompt da spec lista.
4. Leia a resposta antes de copiar. Ela traz cada arquivo completo, com o
   caminho.
5. Crie ou substitua os arquivos no seu editor.
6. Rode `make test` (ou os comandos do README). Se falhar, cole o **erro
   inteiro** de volta na mesma conversa.
7. Atualize a seção "Execuções" da spec com o que o chat devolveu e faça o
   commit no formato `1.1 feat(api): <resumo>` (o mesmo da skill `commit`).

O fluxo completo das skills está em
[`docs/workflow/development-flow.md`](../docs/workflow/development-flow.md).

## Ficou para trás?

```bash
git fetch
git checkout final
```

A branch `final` tem o projeto pronto. Siga assistindo e volte para o seu
código depois.
