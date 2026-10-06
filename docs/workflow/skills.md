# Skills do repositório

Skills são prompts com nome, guardados em `.cursor/skills/<nome>/SKILL.md` e
versionados no git. No chat do agente do Cursor, digite `/` e o nome da skill.
Todas usam `disable-model-invocation: true`: só rodam quando chamadas pelo
nome.

Fora do Cursor (Copilot, Claude Code, Antigravity…), peça ao agente: "siga
`.cursor/skills/<nome>/SKILL.md` com <entrada>". As skills são markdown e
funcionam em qualquer ferramenta que leia os arquivos do repositório. Num chat
de navegador, use [`prompts/run-skill.md`](../../prompts/run-skill.md).

## Duas regras que valem para todas

- **Dois modos.** Com Linear, planos e slices são tickets (`GAM-12`,
  `GAM-13`) e os arquivos levam o ID do ticket. Sem Linear (modo local), tudo
  é igual, mas nada vai para o Linear: planos são `1`, `2`… e slices `1.1`,
  `1.2`… Como a skill escolhe o modo: [modes.md](./modes.md). O Linear é
  acessado pelo MCP ([`../architecture/linear-mcp.md`](../architecture/linear-mcp.md)).
- **Toda skill termina com uma seção "Output"**: um resumo em formato fixo do
  que foi feito, dos arquivos gravados, do que ficou em aberto e do próximo
  comando.

## Resumo

| Skill | Entrada (Linear \| local) | Para quê |
|-------|---------------------------|----------|
| [`start-project`](#start-project) | URL do projeto \| nome do projeto | Modelar um projeto novo (SPIKE) |
| [`continue-project`](#continue-project) | URL do projeto \| nome do projeto, + o que mudou | Mudar ou ampliar as regras de um projeto |
| [`start-new-plan`](#start-new-plan) | URL \| nome do projeto, + título do plano | Planejar uma entrega em steps |
| [`continue-plan`](#continue-plan) | `GAM-12` \| `1` | Retomar um plano: o que foi feito, o que falta, inconsistências |
| [`create-slice`](#create-slice) | `GAM-12` \| `1`, + número do step | Especificar um step |
| [`create-slices`](#create-slices) | `GAM-12` \| `1` | Especificar todos os steps (orchestrator) |
| [`execute-slice`](#execute-slice) | `GAM-13` \| `1.1` | Implementar um slice, nesta conversa |
| [`commit`](#commit) | `GAM-13` \| `1.1` (opcional) | Commitar o que está staged, em Conventional Commits com o ticket |

O fluxo completo, na ordem: [development-flow.md](./development-flow.md).

---

## start-project

**Arquivo:** [`.cursor/skills/start-project/SKILL.md`](../../.cursor/skills/start-project/SKILL.md)

**O que faz:** discovery de um projeto novo, no formato de um ticket SPIKE. O
agente entra em modo de entrevista: resume o que entendeu e faz perguntas em
rodadas de até 5, sempre com uma sugestão.

**Entrada:** URL do projeto no Linear, ou o nome do projeto com "sem Linear";
mais qualquer contexto inicial.

**Saída:**
- `docs/product/<projeto>/` com `README.md`, `business-rules.md`,
  `domain-model.md`, `edge-cases.md`, `decisions.md` e `open-questions.md`
  (cada arquivo só quando tiver conteúdo), e uma linha nova na tabela de
  projetos de `docs/product/business-rules.md`.
- Modo Linear: descrição do projeto no Linear, se você aprovar. A pergunta é
  feita ao fim de **cada** rodada.
- Output: o que foi confirmado, o que ficou em aberto, arquivos gravados e o
  próximo passo.

**Cuidados:** só entram definições confirmadas. Se a pasta já existe, a skill
para e indica `continue-project`. Não escreve código.

## continue-project

**Arquivo:** [`.cursor/skills/continue-project/SKILL.md`](../../.cursor/skills/continue-project/SKILL.md)

**O que faz:** o mesmo discovery para um projeto em andamento. Antes das
perguntas, classifica a mudança (descoberta nova, mudança de regra, correção,
resposta a uma dúvida) e mostra o impacto em regras, planos, slices e código.

**Entrada:** URL ou nome do projeto, e o contexto da mudança.

**Saída:** arquivos do produto atualizados, uma entrada nova em `decisions.md`
para cada mudança (sem apagar a antiga), descrição do projeto no Linear se você
aprovar (modo Linear) e um Output com as mudanças e o impacto.

**Cuidados:** não altera planos, slices nem código; indica `continue-plan` e
`create-slice` quando algo ficou desatualizado.

## start-new-plan

**Arquivo:** [`.cursor/skills/start-new-plan/SKILL.md`](../../.cursor/skills/start-new-plan/SKILL.md)

**O que faz:** lê o produto e o código atual, compara os dois, tira as dúvidas
e divide a entrega em steps pequenos e ordenados.

**Entrada:** URL ou nome do projeto, título do plano e contexto opcional.

**Saída:**
- Modo Linear: ticket do plano no time e no projeto certos.
- `docs/history/plans/<id>-<titulo>.md` (ex.: `gam-12-pedidos-na-api.md` ou
  `1-pedidos-na-api.md`).
- Linhas novas nos índices `docs/history/plans/README.md` e
  `docs/product/<projeto>/README.md`.
- Output com objetivo, tabela de steps e próximo comando.

**Cuidados:** o plano só é registrado depois da sua confirmação. Regras de
negócio que faltarem voltam para `continue-project`.

## continue-plan

**Arquivo:** [`.cursor/skills/continue-plan/SKILL.md`](../../.cursor/skills/continue-plan/SKILL.md)

**O que faz:** retoma um plano já iniciado. Lê tudo o que existe (plano,
slices, execuções, produto, código e, no modo Linear, os tickets), resume o que
foi feito e o que falta, procura inconsistências e só então pergunta sobre
mudanças. Exemplos de inconsistência: step sem o slice que aponta, slice
executado cujo código sumiu, regra mudada depois da spec, ticket concluído sem
execução registrada, prompt no Linear diferente do arquivo.

**Entrada:** ID do plano (`GAM-12` ou `1`) e, se houver, o que mudou.

**Saída:** tabela de status dos steps, lista de inconsistências, plano
atualizado com uma linha nova no "Histórico" (se houver mudança) e, no modo
Linear, descrição do ticket sincronizada.

**Cuidados:** step executado não é reescrito (a mudança vira step novo). Slice
especificado de um step alterado fica marcado como desatualizado. Status no
Linear só muda com sua aprovação.

## create-slice

**Arquivo:** [`.cursor/skills/create-slice/SKILL.md`](../../.cursor/skills/create-slice/SKILL.md)

**O que faz:** transforma um step em um slice executável. Lê todo o contexto e
procura lacunas: regra ambígua, conflito entre produto, plano e código,
arquivo que não existe, caso extremo sem comportamento, nome não definido,
critério de aceite que não dá para verificar, step grande demais. Pergunta até
não sobrar nenhuma.

**Entrada:** ID do plano (`GAM-12` ou `1`) e número do step.

**Saída:** um slice com três partes, iguais no Linear e no arquivo:

- **Descrição**: o que o slice entrega e por quê.
- **Critérios de aceite**: itens verificáveis, ligados às regras (R2, E4).
- **Prompt**: o prompt que `execute-slice` vai rodar, com objetivo, arquivos a
  ler, escopo, fora de escopo, arquivos a alterar, testes com nome, restrições
  e critério de pronto.

Onde fica: sub-issue no Linear, filha do ticket do plano (modo Linear), e
`docs/history/slices/<id>-<titulo>.md` (`gam-13-…` ou `1.1-…`). O plano e o
índice de slices são atualizados, e o Output é o sumário no formato fixo da
skill, terminando com `/execute-slice <ID>`.

**Cuidados:** respostas que definem regra de negócio são oferecidas para
registro em `docs/product/`. Não escreve código.

## create-slices

**Arquivo:** [`.cursor/skills/create-slices/SKILL.md`](../../.cursor/skills/create-slices/SKILL.md)

**O que faz:** o `create-slice` para todos os steps sem slice, como
**orchestrator**. Um subagente por step lê e analisa, sem gravar nada; as
lacunas de todos voltam juntas; o orchestrator confere a consistência entre os
steps, faz as perguntas e registra os slices em ordem.

**Entrada:** ID do plano (`GAM-12` ou `1`).

**Saída:** as mesmas do `create-slice`, para cada step, mais uma tabela geral.

**Cuidados:** subagentes só analisam: não veem a conversa, não gravam arquivos
e não falam com você. Os slices são registrados um de cada vez, na ordem dos
steps.

## execute-slice

**Arquivo:** [`.cursor/skills/execute-slice/SKILL.md`](../../.cursor/skills/execute-slice/SKILL.md)

**O que faz:** implementa exatamente um slice, **na própria conversa** (sem
subagentes). Lê o contexto (padrões, produto, plano, slices anteriores), depois
a descrição e os critérios de aceite, e então executa o **Prompt** do slice.
Roda `make test` e `make lint`, confere os critérios de aceite e registra a
execução na seção "Execuções" do arquivo do slice.

**Entrada:** ID do slice: `GAM-13` (lê o ticket no Linear; o prompt do ticket
vale, e se for diferente do arquivo a skill pergunta) ou `1.1` (lê
`docs/history/slices/1.1-*.md`).

**Saída:** código e testes, registro da execução na spec, plano e índice
atualizados, e um Output com arquivos, testes, critérios de aceite e a
mensagem de commit sugerida. No modo Linear, oferece comentar o resultado no
ticket.

**Cuidados:** sem prompt, não implementa. Não faz commit, não muda status no
Linear e não começa o próximo slice.

## commit

**Arquivo:** [`.cursor/skills/commit/SKILL.md`](../../.cursor/skills/commit/SKILL.md)

**O que faz:** transforma o que está **staged** em um commit. Lê o diff
staged, descobre o ticket, escreve a mensagem e pede confirmação antes de
gravar.

**Entrada:** opcional, o ID do ticket. Sem ele, a skill procura no nome da
branch e nos arquivos de `docs/history/` que estão staged; se não achar,
pergunta (e aceita "sem ticket").

**Formato:** Conventional Commits começando pelo ticket, em inglês:

```text
GAM-13 feat(api): add product model and admin
1.2 test(api): cover inactive products in product list
```

Tipos: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `perf`, `build`,
`ci`, `chore`. O escopo (`api`, `web`, `docs`, `skills`…) é opcional.

**Saída:** o commit e um Output com o hash, a mensagem, de onde veio o
ticket, os arquivos commitados e o que ficou de fora.

**Cuidados:** **nunca** roda `git add`, `git restore`, `git stash` ou
`git reset`: o que entra é decisão sua. Se houver arquivo modificado sem
stage ou arquivo novo sem rastrear, avisa e pergunta se segue só com o que
está staged. Avisa também sobre `.env`, tokens, `node_modules/` e afins. Não
faz `--amend`, `--no-verify` nem push sem você pedir.
