# Regras de negócio

Ponto de partida da documentação de produto: o **que** os sistemas deste
repositório fazem. É a fonte de verdade. Se o código e estes documentos
discordam, os documentos vencem e a dúvida vai para a pessoa responsável. Se
uma regra muda, ela muda primeiro aqui.

## Projetos

| Projeto | Em uma frase | Linear |
|---------|--------------|--------|
| [Sistema de pedidos](./sistema-de-pedidos/README.md) | Produtos no Django Admin, pedido no app web, validação e total na API | [Workshop-setec](https://linear.app/toralinetech/project/workshop-setec-378144e405f4) |

<!-- start-project adiciona uma linha aqui para cada projeto novo. -->

## Como cada projeto é documentado

Cada projeto tem uma pasta própria em `docs/product/<projeto>/`, com o nome em
kebab-case e sem acentos. A pasta é criada pela skill
[`start-project`](../../.cursor/skills/start-project/SKILL.md) e alterada pela
[`continue-project`](../../.cursor/skills/continue-project/SKILL.md).

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Visão geral, escopo, link do projeto no Linear e índice dos arquivos |
| `business-rules.md` | Regras numeradas (R1, R2…) |
| `domain-model.md` | Entidades, campos e relações |
| `edge-cases.md` | Casos extremos (E1, E2…) e o comportamento esperado de cada um |
| `decisions.md` | Registro datado das decisões, inclusive as que substituem outras |
| `open-questions.md` | Dúvidas ainda sem resposta |

Um arquivo só existe quando tem conteúdo, e o projeto pode ter outros quando
fizer sentido (o sistema de pedidos tem `api-contract.md`). O `README.md` de
cada projeto lista os que existem.

Só entram nesses arquivos definições **confirmadas**. Dúvidas ficam em
`open-questions.md` até serem respondidas.

Modelo do README de projeto: [`../templates/product-readme.md`](../templates/product-readme.md).
