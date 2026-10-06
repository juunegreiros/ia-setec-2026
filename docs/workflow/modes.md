# Modo Linear e modo local

Todas as skills funcionam de dois jeitos. O fluxo, as perguntas, os arquivos e
os relatórios são **os mesmos**; muda só onde o registro fica e como os itens
são numerados.

| | Modo Linear | Modo local |
|---|-------------|------------|
| Quando | Você tem um projeto no Linear e o MCP conectado | Sem Linear, sem MCP, ou por escolha |
| Projeto | Projeto do Linear (entrada: URL) | Só a pasta `docs/product/<projeto>/` (entrada: nome do projeto) |
| Plano | Ticket do Linear, ex.: `GAM-12` | Número sequencial, ex.: `1` |
| Slice | Sub-issue do ticket do plano, ex.: `GAM-13` | `<plano>.<step>`, ex.: `1.1` |
| Arquivo do plano | `docs/history/plans/gam-12-pedidos-na-api.md` | `docs/history/plans/1-pedidos-na-api.md` |
| Arquivo do slice | `docs/history/slices/gam-13-model-product-e-admin.md` | `docs/history/slices/1.1-model-product-e-admin.md` |
| Descrição do projeto | Atualizada no Linear, se você aprovar | Só no `README.md` do projeto |
| Executar | `/execute-slice GAM-13` | `/execute-slice 1.1` |

## Como a skill escolhe o modo

1. A entrada é uma URL ou um ID do Linear (`GAM-12`) → **modo Linear**.
2. A entrada é um nome de projeto, um número de plano (`1`) ou um id de slice
   (`1.1`) → **modo local**.
3. Você diz "sem Linear" → **modo local**.
4. O modo é Linear, mas o MCP não responde → a skill avisa e pergunta: conectar
   o MCP e tentar de novo, ou seguir em **modo local**. Ela nunca inventa um ID
   do Linear.

## Numeração no modo local

- **Plano:** o próximo número livre em `docs/history/plans/` (o maior `<n>-*.md`
  mais um). O primeiro plano é `1`.
- **Slice:** número do plano, ponto, número do step. O step 2 do plano 1 é `1.2`.

Os dois modos podem conviver no mesmo repositório: planos `gam-12-…` e `1-…`
ficam lado a lado na mesma pasta.

## O que o modo local não tem

- Não há sub-issues nem status para acompanhar fora do repositório: o status
  fica no próprio arquivo (campo `Status` do plano e do slice) e nos índices
  `docs/history/plans/README.md` e `docs/history/slices/README.md`.
- A seção `Prompt` do slice existe só no arquivo, e o `execute-slice` lê de lá.
