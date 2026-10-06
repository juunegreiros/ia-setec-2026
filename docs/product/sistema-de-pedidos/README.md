# Sistema de pedidos

| Campo | Valor |
|-------|-------|
| Projeto no Linear | [Workshop-setec](https://linear.app/toralinetech/project/workshop-setec-378144e405f4) |
| Discovery | concluído |
| Última atualização | 2026-10-06 — reorganização da documentação de produto |

## Em uma frase

Produtos são cadastrados no Django Admin. O app web lista os produtos ativos,
deixa a pessoa escolher uma quantidade para cada um, mostra o total, pede o
nome de quem está comprando e envia. A API valida e grava um **pedido**.

## Quem usa

| Pessoa | Onde | O que faz |
|--------|------|-----------|
| Administração | Django Admin (`http://localhost:8000/admin/`) | Cadastra, edita e desativa produtos; consulta pedidos |
| Cliente | App web (`http://localhost:3000`) | Escolhe quantidades, informa o nome e envia o pedido |

## Escopo

**Dentro:** cadastro de produtos no Admin, listagem de produtos ativos no app,
criação de pedido com validação e total calculado pela API.

**Fora:** login de cliente, pagamento, estoque, frete, edição ou cancelamento
de pedido pelo app e e-mail de confirmação. Ficam como desafio para depois do
workshop.

## Documentos

| Arquivo | Conteúdo |
|---------|----------|
| [business-rules.md](./business-rules.md) | Regras R1–R11 |
| [domain-model.md](./domain-model.md) | Produto, pedido e item do pedido: campos e restrições |
| [api-contract.md](./api-contract.md) | Endpoints, formato do pedido e respostas |
| [edge-cases.md](./edge-cases.md) | Casos extremos E1–E17 e o resultado esperado de cada um |
| [open-questions.md](./open-questions.md) | Dúvidas ainda sem resposta |

## Planos deste projeto

| Ticket | Plano |
|--------|-------|
| — | Nenhum plano ainda |
