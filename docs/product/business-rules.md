# Regras de negócio — Sistema de pedidos

Este documento é a fonte de verdade do **que** o sistema faz. Código, plano e
testes derivam daqui. Se uma regra mudar, ela muda primeiro neste arquivo.

## O sistema em uma frase

Produtos são cadastrados no Django Admin. O app web lista os produtos ativos,
deixa a pessoa escolher uma quantidade para cada um, mostra o total, pede o
nome de quem está comprando e envia. A API valida e grava um **Pedido**.

## Quem usa

| Pessoa | Onde | O que faz |
|--------|------|-----------|
| Administração | Django Admin (`http://localhost:8000/admin/`) | Cadastra, edita e desativa produtos; consulta pedidos |
| Cliente | App web (`http://localhost:3000`) | Escolhe quantidades, informa o nome e envia o pedido |

## Entidades

### Produto

| Campo | Regra |
|-------|-------|
| Nome | Obrigatório |
| Preço | Decimal com duas casas, **maior que zero** |
| Ativo | Sim/não. Só produtos ativos aparecem no app e podem ser pedidos |

### Pedido

| Campo | Regra |
|-------|-------|
| Nome do cliente | Obrigatório; não pode ser vazio nem só espaços |
| Itens | Pelo menos um item |
| Total | Calculado **sempre** pela API |

### Item do pedido

| Campo | Regra |
|-------|-------|
| Produto | Produto ativo e existente |
| Quantidade | Inteiro de 1 a 99 |
| Preço unitário | Copiado do produto **no momento da compra** |

## Regras

1. **O total é sempre calculado pela API.** Se o cliente enviar um total, ele é
   ignorado. O total é a soma de `preço unitário × quantidade` de cada item.
2. **Cada item guarda o preço unitário do momento da compra.** Mudar o preço do
   produto depois nunca altera pedidos já feitos.
3. **Item com quantidade zero não faz parte do pedido.** O app não envia
   produtos com quantidade zero. Se a API receber um item com quantidade zero,
   ela o descarta (não rejeita o pedido por isso). Se todos os itens forem zero,
   o pedido fica sem itens e cai na regra 5.
4. **A quantidade de um item gravado é um inteiro de 1 a 99.** Valor negativo,
   decimal ou maior que 99 rejeita o pedido **inteiro**, não só o item.
5. **Pedido sem itens é rejeitado.**
6. **Nome do cliente vazio ou só com espaços é rejeitado.**
7. **Produto inativo ou inexistente** não aparece na listagem e, se for enviado
   em um pedido, rejeita o pedido.
8. **O mesmo produto duas vezes no mesmo pedido rejeita o pedido.** O app manda
   uma linha por produto.
9. **Dinheiro usa Decimal com duas casas, nunca float.** Isso vale para o banco,
   para os cálculos e para o JSON (preços trafegam como string, ex.: `"12.50"`).
10. **Produto que já tem pedidos não pode ser excluído;** ele é desativado.
11. Pedido rejeitado **não grava nada**: nem o pedido, nem parte dos itens.

## Endpoints

| Método | Caminho | O que faz |
|--------|---------|-----------|
| `GET` | `/api/products/` | Lista **só** os produtos ativos |
| `POST` | `/api/orders/` | Valida e cria um pedido |

Formato sugerido do `POST /api/orders/`:

```json
{
  "customer_name": "Ana",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

Respostas esperadas:

- `201 Created` com o pedido gravado, incluindo o `total` calculado e o preço
  unitário de cada item.
- `400 Bad Request` com a mensagem de erro de validação, sem gravar nada.

## Casos extremos

Cada linha abaixo vira pelo menos um teste. O mapeamento para os testes está em
[`docs/plan.reference.md`](../plan.reference.md).

| # | Situação | Resultado esperado |
|---|----------|--------------------|
| E1 | Cliente envia `total` diferente do real | Total ignorado; API grava o total calculado |
| E2 | Preço do produto muda depois do pedido | Pedido antigo mantém preço unitário e total |
| E3 | Item com quantidade 0 (no app ou enviado direto à API) | Item não é enviado; se chegar à API, é descartado e não é gravado |
| E3b | Todos os itens com quantidade 0 | Vira pedido sem itens: rejeitado (400) |
| E4 | Quantidade negativa | Pedido inteiro rejeitado (400) |
| E5 | Quantidade decimal (ex.: 1.5) | Pedido inteiro rejeitado (400) |
| E6 | Quantidade maior que 99 | Pedido inteiro rejeitado (400) |
| E7 | Quantidade 1 e 99 (limites) | Aceitas |
| E8 | Lista de itens vazia | Pedido rejeitado (400) |
| E9 | Nome vazio ou só espaços | Pedido rejeitado (400) |
| E10 | Produto inativo enviado | Pedido rejeitado (400) |
| E11 | Produto inexistente enviado | Pedido rejeitado (400) |
| E12 | Mesmo produto duas vezes | Pedido rejeitado (400) |
| E13 | Preço zero ou negativo no Admin | Cadastro rejeitado |
| E14 | Produto inativo na listagem | Não aparece em `GET /api/products/` |
| E15 | Excluir produto com pedidos | Exclusão bloqueada; produto pode ser desativado |
| E16 | Soma de preços com centavos (ex.: 0.10 × 3) | Total exato (`0.30`), sem erro de float |
| E17 | Pedido rejeitado no meio da validação | Nada é gravado |

## Fora de escopo

Login de cliente, pagamento, estoque, frete, edição ou cancelamento de pedido
pelo app, e e-mail de confirmação. Ficam como desafio para depois do workshop.
