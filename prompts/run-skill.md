# Rodar uma skill num chat do navegador

Use quando seu chat não lê nem escreve os arquivos do projeto. Funciona para
qualquer skill de `.cursor/skills/`. Abra uma **conversa nova** por skill (e por
slice, no caso de `execute-slice`).

Troque `<skill>` e `<entrada>`, cole o prompt e, logo abaixo, cole os arquivos
que ele pedir.

````text
Você vai seguir a skill "<skill>" deste projeto. Você não vê meus arquivos:
eu colo abaixo tudo o que você precisa. Entrada da skill: <entrada>

MODO
Use sempre o modo local: não existe Linear nesta conversa. Planos são
numerados 1, 2…; slices são <plano>.<step> (1.1, 1.2…). Não invente IDs de
ticket.

EU VOU COLAR, NESTA ORDEM
1. .cursor/skills/<skill>/SKILL.md — siga os passos dela.
2. Os arquivos que a skill manda ler. Se faltar algum, peça pelo caminho antes
   de continuar.

COMO RESPONDER
- Siga as perguntas e confirmações da skill: pergunte quando ela manda
  perguntar e espere minha resposta.
- Você não pode criar nem editar arquivos. Quando a skill mandar escrever um
  arquivo, entregue o conteúdo completo (não um diff), assim:
  ### caminho/do/arquivo
  ```linguagem
  conteúdo completo
  ```
- Quando a skill mandar rodar um comando (make test, makemigrations…), diga o
  comando e espere eu colar o resultado.
- Termine com a seção "Output" da skill.
````

## O que colar, por skill

| Skill | Cole, além da SKILL.md |
|-------|------------------------|
| `start-project` | `docs/product/business-rules.md`, `docs/templates/product-readme.md` |
| `continue-project` | Todos os arquivos de `docs/product/<projeto>/` e os planos do projeto |
| `start-new-plan` | `docs/product/<projeto>/`, `docs/architecture/project-standards.md`, `docs/templates/plan.md` e o código que o plano envolve |
| `continue-plan` | O plano, os slices dele, `docs/product/<projeto>/` |
| `create-slice` | O plano, `docs/product/<projeto>/`, `docs/architecture/project-standards.md`, `docs/templates/slice.md` e os arquivos de código do step |
| `execute-slice` | A spec do slice (`docs/history/slices/<id>-*.md`) e cada arquivo listado em `[LEIA ANTES]` e `[ARQUIVOS]` do prompt dela |

`create-slices` usa subagentes, que um chat não tem: rode `create-slice` uma
vez por step.
