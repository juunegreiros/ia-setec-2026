# Slices

Cada slice é um step de um plano, pronto para executar. No modo Linear, é uma
**sub-issue** do ticket do plano; no modo local, é `<plano>.<step>` (`1.1`,
`1.2`…). O arquivo tem três partes, iguais às da sub-issue:

- **Descrição**: o que o slice entrega e por quê.
- **Critérios de aceite**: como verificar que está pronto.
- **Prompt**: o que `execute-slice` executa (arquivos, escopo, testes com nome,
  restrições).

Depois de executado, o mesmo arquivo registra a execução.

- Criar um: [`/create-slice`](../../../.cursor/skills/create-slice/SKILL.md) com o ID do plano e o número do step.
- Criar todos os de um plano: [`/create-slices`](../../../.cursor/skills/create-slices/SKILL.md) com o ID do plano.
- Executar: [`/execute-slice`](../../../.cursor/skills/execute-slice/SKILL.md) com o ID do slice.
- Modelo: [`../../templates/slice.md`](../../templates/slice.md).
- Nome do arquivo: `<id>-<titulo>.md`, ex.: `gam-13-modelo-de-produto.md` ou `1.1-modelo-de-produto.md`.

## Índice

| ID | Slice | Plano | Step | Status |
|----|-------|-------|------|--------|
| — | Nenhum slice ainda | — | — | — |
