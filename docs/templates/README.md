# Modelos

Modelos que as skills preenchem. Também servem para escrever à mão, se você
preferir não usar a skill.

| Modelo | Usado por | Vira |
|--------|-----------|------|
| [product-readme.md](./product-readme.md) | `start-project` | `docs/product/<projeto>/README.md` |
| [plan.md](./plan.md) | `start-new-plan`, `continue-plan` | `docs/history/plans/<id>-<titulo>.md` |
| [slice.md](./slice.md) | `create-slice`, `create-slices`, `execute-slice` | `docs/history/slices/<id>-<titulo>.md` |

No modo Linear, as seções Descrição, Critérios de aceite e Prompt de
`slice.md` também viram a descrição da sub-issue.

Texto entre `<…>` é para substituir. Comentários `<!-- … -->` são instruções e
saem do arquivo final.
