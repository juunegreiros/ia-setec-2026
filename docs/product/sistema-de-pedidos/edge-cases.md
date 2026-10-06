# Casos extremos — Sistema de pedidos

Cada linha vira pelo menos um teste, com nome, na spec do slice que a cobre.

| # | Situação | Resultado esperado | Regra |
|---|----------|--------------------|-------|
| E1 | Cliente envia `total` diferente do real | Total ignorado; API grava o total calculado | R1 |
| E2 | Preço do produto muda depois do pedido | Pedido antigo mantém preço unitário e total | R2 |
| E3 | Item com quantidade 0 (no app ou enviado direto à API) | Item não é enviado; se chegar à API, é descartado e não é gravado | R3 |
| E3b | Todos os itens com quantidade 0 | Vira pedido sem itens: rejeitado (400) | R3, R5 |
| E4 | Quantidade negativa | Pedido inteiro rejeitado (400) | R4 |
| E5 | Quantidade decimal (ex.: 1.5) | Pedido inteiro rejeitado (400) | R4 |
| E6 | Quantidade maior que 99 | Pedido inteiro rejeitado (400) | R4 |
| E7 | Quantidade 1 e 99 (limites) | Aceitas | R4 |
| E8 | Lista de itens vazia | Pedido rejeitado (400) | R5 |
| E9 | Nome vazio ou só espaços | Pedido rejeitado (400) | R6 |
| E10 | Produto inativo enviado | Pedido rejeitado (400) | R7 |
| E11 | Produto inexistente enviado | Pedido rejeitado (400) | R7 |
| E12 | Mesmo produto duas vezes | Pedido rejeitado (400) | R8 |
| E13 | Preço zero ou negativo no Admin | Cadastro rejeitado | Produto: preço > 0 |
| E14 | Produto inativo na listagem | Não aparece em `GET /api/products/` | R7 |
| E15 | Excluir produto com pedidos | Exclusão bloqueada; produto pode ser desativado | R10 |
| E16 | Soma de preços com centavos (ex.: 0.10 × 3) | Total exato (`0.30`), sem erro de float | R9 |
| E17 | Pedido rejeitado no meio da validação | Nada é gravado | R11 |
