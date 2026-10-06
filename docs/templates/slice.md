# <ID> — <Título do slice>

| Campo | Valor |
|-------|-------|
| Ticket | [<ID>](<url do ticket>) \| local |
| Plano | [<ID do plano> — <título>](../plans/<arquivo-do-plano>.md), Step <n> |
| Projeto | [`docs/product/<projeto>/`](../../product/<projeto>/README.md) |
| Status | especificado \| executado |
| Criado em | <AAAA-MM-DD> |

<!--
As seções Descrição, Critérios de aceite e Prompt são copiadas, iguais, para
a descrição da sub-issue no Linear (modo Linear). Decisões e Execuções ficam só
neste arquivo.
-->

## Descrição

<O que este slice entrega e por quê, em duas a quatro frases. O que já existe
e ele usa. O que os slices anteriores entregaram.>

## Critérios de aceite

- [ ] <comportamento verificável, ligado a uma regra ou caso extremo (R2, E4)>
- [ ] <…>
- [ ] `make test` e `make lint` passam.

## Prompt

```text
Implemente o slice <ID> — <título>.
Ticket: <url> | local · Plano: <ID do plano>, Step <n> · Spec: docs/history/slices/<arquivo>.md

[OBJETIVO]
<Uma ou duas frases.>

[LEIA ANTES]
- .cursor/rules/code-quality.mdc
- docs/architecture/project-standards.md
- docs/product/<projeto>/ (todos os arquivos)
- <arquivos de código que este slice altera ou usa>

[CONTEXTO]
<O que já existe e este slice usa, com caminhos verificados.>

[ESCOPO]
- <…>

[FORA DE ESCOPO]
- <…>

[ARQUIVOS]
- <caminho> — criar | alterar — <por quê>

[REGRAS E TESTES]
- <R2 / E4> — <comportamento esperado> — teste <nome_do_teste>

[RESTRIÇÕES]
- Toque só nos arquivos listados. Precisou de outro? Pare e pergunte.
- Não invente regra, nome de campo, endpoint, mensagem ou formato que não
  esteja aqui ou em docs/product/. Faltou? Pare e pergunte.
- Escreva cada teste listado, com esse nome.
- Migrations só com makemigrations. Não faça commit.

[PRONTO QUANDO]
- <critérios de aceite, verificáveis>
- make test e make lint passam.

[SAÍDA]
Relatório no formato da skill execute-slice.
```

## Decisões tomadas na especificação

<!-- Perguntas que surgiram ao criar o slice e a resposta da pessoa. -->

- <pergunta> → <resposta>

## Execuções

<!-- execute-slice adiciona uma entrada por execução. Não edite as anteriores. -->

Ainda não executado.
