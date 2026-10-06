# Fluxo de desenvolvimento com skills

A ideia central: **o agente nunca começa pelo código**. Primeiro se decide o
que o sistema faz (produto), depois o que entregar e em que ordem (plano),
depois exatamente o que cada pedaço faz (slice). Só então o código é escrito,
um slice por vez, e a pessoa lê o diff e faz o commit.

Cada etapa deixa um arquivo no repositório e, no modo Linear, um registro no
Linear. Assim, a próxima conversa com o agente (ou outra pessoa do time)
começa com o contexto escrito, e não com a memória de quem estava lá.

Sem Linear, o fluxo é o mesmo: nada vai para o Linear, planos são numerados
`1`, `2`… e slices `1.1`, `1.2`… Detalhes em [modes.md](./modes.md).

## Visão geral

```text
Linear: projeto            Linear: ticket          Linear: sub-issues
(local: nome)              (local: 1, 2…)          (local: 1.1, 1.2…)
      │                         │                        │
      ▼                         ▼                        ▼
 1. start-project  ──►  3. start-new-plan  ──►  5. create-slice(s)  ──►  6. execute-slice  ──►  7. git add + /commit
 2. continue-project     4. continue-plan                                   (um por vez)
      │                         │                        │                        │
      ▼                         ▼                        ▼                        ▼
 docs/product/<projeto>/   docs/history/plans/    docs/history/slices/    código + testes +
                                                                           "Execuções" na spec
```

| Etapa | Skill | Entrada (Linear \| local) | Sai no repositório | Sai no Linear |
|-------|-------|---------------------------|--------------------|---------------|
| 1. Modelar o projeto | `/start-project` | URL do projeto \| nome, + contexto | `docs/product/<projeto>/` | Descrição do projeto (se você aprovar) |
| 2. Mudar ou ampliar o produto | `/continue-project` | URL \| nome, + o que mudou | Arquivos do produto + `decisions.md` | Descrição do projeto (se você aprovar) |
| 3. Planejar uma entrega | `/start-new-plan` | URL \| nome, + título do plano | `docs/history/plans/<id>-<titulo>.md` | Ticket do plano |
| 4. Retomar ou ajustar o plano | `/continue-plan` | `GAM-12` \| `1` | Status, inconsistências, plano atualizado | Descrição do ticket |
| 5. Especificar | `/create-slice` ou `/create-slices` | `GAM-12` \| `1` (+ step) | `docs/history/slices/<id>-<titulo>.md` | Sub-issue com Descrição, Critérios de aceite e Prompt |
| 6. Implementar | `/execute-slice` | `GAM-13` \| `1.1` | Código, testes e registro em "Execuções" | Comentário (se você aprovar); status nunca |
| 7. Commit | você faz `git add`; depois `/commit` | `GAM-13` \| `1.1` (opcional) | Commit `GAM-13 feat(api): …` com o que estava staged | — |

Toda skill termina com uma seção **Output**: o que foi feito, os arquivos
gravados, o que ficou em aberto e o próximo comando.

## Etapa por etapa

### 1. Modelar o projeto — `start-project`

Funciona como um ticket SPIKE: uma investigação com tempo limitado cujo
resultado é conhecimento, não código. O agente lê o projeto no Linear (ou o
nome e o contexto que você deu) e faz perguntas em rodadas curtas sobre
problema, usuários, escopo, entidades, regras e casos extremos.

- Só vai para `docs/product/<projeto>/` o que você **confirmou**. O resto fica
  em `open-questions.md`.
- O projeto ganha uma linha em `docs/product/business-rules.md`, a porta de
  entrada da documentação de produto.
- No modo Linear, ao final de cada rodada, ele pergunta se deve atualizar a
  descrição do projeto no Linear, e mostra o texto antes de gravar.

### 2. Mudar ou ampliar o produto — `continue-project`

Para um projeto que já tem `docs/product/<projeto>/`. Antes de mudar qualquer
coisa, o agente mostra o **impacto**: quais regras mudam, quais planos e slices
dependiam delas e qual código já implementa o comportamento antigo. A mudança
fica registrada em `decisions.md`, sem apagar a decisão anterior.

### 3. Planejar uma entrega — `start-new-plan`

O agente lê o produto **e** o código atual, compara os dois ("o que existe
hoje") e propõe um plano dividido em **steps**: pedaços pequenos, testáveis
sozinhos, em ordem de dependência. Depois que você confirma, ele cria o ticket
no Linear (ou usa o próximo número livre) e salva o plano com esse ID no nome.

O plano **referencia** regras de negócio, não as define. Se faltar uma regra,
ela volta para o produto (`continue-project`).

### 4. Retomar ou ajustar o plano — `continue-plan`

Para um plano já iniciado. O agente lê tudo o que existe, mostra o que foi
feito e o que falta, aponta **inconsistências** (entre plano, slices, código,
produto e Linear) e só então pergunta o que mudar. Step já executado não é
reescrito: a mudança vira um step novo. Toda alteração ganha uma linha na seção
"Histórico" do plano.

### 5. Especificar — `create-slice` e `create-slices`

O ponto mais importante do fluxo. O agente lê tudo (plano, produto, padrões,
slices anteriores e o código real) e procura **espaço para alucinação**: tudo
o que o agente que vai implementar teria de decidir ou inventar, como uma regra
ambígua, um nome de campo não definido, uma mensagem de erro, um caso extremo
sem comportamento. Cada lacuna vira uma pergunta para você, até não sobrar
nenhuma.

- `create-slice` faz isso para um step.
- `create-slices` faz para o plano inteiro como um **orchestrator**: um
  subagente analisa cada step, todas as perguntas voltam para você de uma vez,
  e os slices são registrados em ordem.

O resultado é um slice com **Descrição**, **Critérios de aceite** e um
**Prompt** pronto para executar, iguais na sub-issue do Linear e em
`docs/history/slices/`.

### 6. Implementar — `execute-slice`

Recebe o ID do slice e trabalha **na própria conversa**: lê o contexto, a
descrição e os critérios de aceite, e então executa o Prompt. Implementa
**só** aquilo, roda `make test` e `make lint`, confere os critérios de aceite e
registra a execução no arquivo do slice. Uma conversa por slice: contexto
limpo, escopo pequeno, diff fácil de revisar.

### 7. Commit — você e `/commit`

Leia o diff inteiro. Se estiver certo, faça `git add` do que deve entrar e rode
`/commit`. A skill não adiciona nada: avisa se sobrou arquivo de fora e
pergunta antes. A mensagem segue Conventional Commits começando pelo ID do
slice (`GAM-14 feat(api): add order creation endpoint` ou
`1.2 feat(api): …`), e só é gravada depois da sua confirmação. O agente nunca
faz commit sozinho nem muda status no Linear sem você pedir.

## Exemplo com Linear

O projeto [Workshop-setec](https://linear.app/toralinetech/project/workshop-setec-378144e405f4)
do Linear já tem o produto modelado em
[`docs/product/sistema-de-pedidos/`](../product/sistema-de-pedidos/README.md).
Os números dos tickets abaixo são ilustrativos:

```text
/start-new-plan https://linear.app/toralinetech/project/workshop-setec-378144e405f4 "Pedidos na API"
    → GAM-12 + docs/history/plans/gam-12-pedidos-na-api.md (3 steps)

/create-slices GAM-12
    → GAM-13, GAM-14, GAM-15 (sub-issues) + docs/history/slices/gam-13-…md, …

/execute-slice GAM-13    → leia o diff → git add → /commit
    → "GAM-13 feat(api): add product model and admin"
/execute-slice GAM-14    → (conversa nova) → leia o diff → git add → /commit

/continue-plan GAM-12    → o que foi feito, o que falta, inconsistências
```

## Exemplo sem Linear

```text
/start-new-plan sistema-de-pedidos "Pedidos na API"
    → docs/history/plans/1-pedidos-na-api.md (3 steps)

/create-slice 1 1        → docs/history/slices/1.1-modelo-de-produto.md
/execute-slice 1.1       → leia o diff → git add → /commit
    → "1.1 feat(api): add product model and admin"
```

## Princípios

- **Escrito vence lembrado.** Toda decisão vai para um arquivo; a conversa com
  o agente é descartável.
- **Perguntar vence adivinhar.** Cada skill para e pergunta quando falta
  informação, sempre com uma sugestão.
- **Pequeno vence grande.** Um step, um slice, uma conversa, um commit.
- **Histórico não se reescreve.** Planos e specs ganham entradas novas; as
  antigas ficam.
- **A pessoa decide.** Nada é gravado no Linear, nenhum status muda e nenhum
  commit é feito sem confirmação.
