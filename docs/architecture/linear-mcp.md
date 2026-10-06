# Linear via MCP

O agente lê e escreve no Linear por um **servidor MCP** (Model Context
Protocol): um adaptador que dá ao agente ferramentas como "ler ticket", "criar
sub-issue" e "atualizar a descrição do projeto". As skills de
[`docs/workflow/`](../workflow/README.md) usam essas ferramentas para manter o
Linear e o repositório em sincronia.

## Configuração versionada

Arquivo: [`.cursor/mcp.json`](../../.cursor/mcp.json)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

- Endpoint oficial do Linear: `https://mcp.linear.app/mcp`.
- O `mcp-remote` faz a ponte e abre o login (OAuth) no navegador na primeira
  conexão. Precisa do Node.js, que o projeto já exige.
- O arquivo só tem o comando e a URL pública: **pode** ir para o git. Nenhum
  token fica no repositório.

## Como conectar

1. Abra o repositório no Cursor.
2. Em **Settings → MCP**, confira que o servidor `linear` aparece e está ligado.
3. Na primeira vez que uma skill usar o Linear, faça o login no navegador com a
   **sua** conta. Cada pessoa usa o próprio workspace.
4. Teste pedindo ao agente: "liste os projetos do meu Linear".

Exemplo usado no workshop: o projeto
[Workshop-setec](https://linear.app/toralinetech/project/workshop-setec-378144e405f4)
(time Games, tickets `GAM-…`). Quem clonar o repositório usa a URL de um projeto
do próprio Linear.

## Como as skills usam o Linear

| Conceito no repositório | No Linear |
|-------------------------|-----------|
| Projeto (`docs/product/<projeto>/`) | Projeto. A descrição do projeto resume as definições confirmadas |
| Plano (`docs/history/plans/`) | Ticket (issue) do projeto |
| Slice (`docs/history/slices/`) | Sub-issue do ticket do plano. A descrição tem `## Descrição`, `## Critérios de aceite` e `## Prompt`, iguais ao arquivo |

O Linear é opcional. Sem ele, as skills rodam no **modo local**: o mesmo fluxo,
com planos numerados `1`, `2`… e slices `1.1`, `1.2`…, só em arquivos. Veja
[`../workflow/modes.md`](../workflow/modes.md).

Regras para qualquer skill:

1. Descobrir as ferramentas do servidor `linear` antes de usar; não presumir
   nomes ou parâmetros.
2. **Escrever no Linear só depois de confirmação explícita** da pessoa (criar
   ticket, editar descrição, mudar status).
3. Nunca mudar o status de um ticket sem a pessoa pedir.
4. Usar apenas o servidor `linear` deste arquivo. Não criar um segundo servidor
   como atalho.

## Quando o MCP não está disponível

1. Avisar claramente que o Linear não respondeu (sem login, sem rede, servidor
   desligado).
2. Perguntar se a pessoa quer conectar o MCP e tentar de novo, ou seguir no
   modo local.
3. **Nunca inventar** IDs de ticket, URLs ou conteúdo do Linear.
4. No modo local, os arquivos em `docs/` seguem normalmente, com IDs locais
   (`1`, `1.1`).

## Problemas comuns

| Sintoma | O que verificar |
|---------|-----------------|
| As ferramentas do Linear não aparecem | `.cursor/mcp.json` existe; servidor ligado em Settings → MCP; reiniciar o servidor |
| Erro de autenticação | Refazer o login no navegador; conta com acesso ao workspace certo |
| `npx` falha | Node.js instalado; acesso à internet; proxy ou firewall |
| Ticket "não encontrado" | ID no formato `GAM-123` ou URL completa; sua conta tem acesso ao time |
