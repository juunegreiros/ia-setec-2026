# Histórico de implementação

Registro de **o que foi planejado, especificado e executado**, na ordem em que
aconteceu. Cada arquivo corresponde a um plano ou slice com ID (o ticket do
Linear, ou um número no modo local), então dá para ir do código ao motivo da
mudança e vice-versa.

| Pasta | O que guarda | Quem cria | No Linear |
|-------|--------------|-----------|-----------|
| [plans/](./plans/README.md) | Planos: um objetivo dividido em steps | `start-new-plan`, atualizado por `continue-plan` | Ticket do projeto |
| [slices/](./slices/README.md) | Slices (descrição, critérios de aceite, prompt) e o registro das execuções | `create-slice` / `create-slices`, atualizado por `execute-slice` | Sub-issue do ticket do plano |

## Nomes dos arquivos

Todo arquivo começa com o **ID** e depois o **título**, em kebab-case,
minúsculo e sem acentos:

| Modo | Plano | Slice |
|------|-------|-------|
| Linear | `plans/gam-12-pedidos-na-api.md` | `slices/gam-13-modelo-de-produto.md` |
| local | `plans/1-pedidos-na-api.md` | `slices/1.1-modelo-de-produto.md` |

No modo local, o plano usa o próximo número livre e o slice é
`<plano>.<step>`. Assim, buscar "gam-13" ou "1.1" no editor (Cmd+P / Ctrl+P)
acha o arquivo. Mais em [`../workflow/modes.md`](../workflow/modes.md).

## Regras

- O histórico **não é reescrito**. Mudou um plano? O arquivo ganha uma entrada
  na seção "Histórico" explicando o quê e por quê. Um slice executado ganha uma
  entrada em "Execuções"; a spec original fica como estava.
- Cada pasta tem um `README.md` com o índice dos arquivos. As skills atualizam
  o índice quando criam um arquivo.
- Modelos: [`../templates/plan.md`](../templates/plan.md) e
  [`../templates/slice.md`](../templates/slice.md).
