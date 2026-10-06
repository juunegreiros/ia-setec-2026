# Fluxo de trabalho

Como desenvolver neste repositório com um agente de IA, do projeto (no Linear
ou só local) até o commit, com a pessoa no controle em cada etapa.

| Documento | Conteúdo |
|-----------|----------|
| [development-flow.md](./development-flow.md) | O fluxo completo, etapa por etapa, com o que entra e o que sai de cada uma |
| [skills.md](./skills.md) | Cada skill: para que serve, entrada, saída e cuidados |
| [modes.md](./modes.md) | Modo Linear e modo local (sem Linear): IDs, nomes de arquivo e como a skill escolhe |

Documentos relacionados:

- Como o agente fala com o Linear: [`../architecture/linear-mcp.md`](../architecture/linear-mcp.md)
- Onde ficam os planos e slices: [`../history/`](../history/README.md)
- Modelos de plano, slice e projeto: [`../templates/`](../templates/README.md)
- As skills em si: [`.cursor/skills/`](../../.cursor/skills/)

Ao criar ou mudar uma skill, atualize [skills.md](./skills.md) e, se a ordem
das etapas mudar, [development-flow.md](./development-flow.md), na mesma entrega.
