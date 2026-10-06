# Modelo de domínio — Sistema de pedidos

As regras que usam estes campos estão em [business-rules.md](./business-rules.md).

## Produto

| Campo | Regra |
|-------|-------|
| Nome | Obrigatório |
| Preço | Decimal com duas casas, **maior que zero** |
| Ativo | Sim/não. Só produtos ativos aparecem no app e podem ser pedidos (R7) |

## Pedido

| Campo | Regra |
|-------|-------|
| Nome do cliente | Obrigatório; não pode ser vazio nem só espaços (R6) |
| Itens | Pelo menos um item (R5) |
| Total | Calculado **sempre** pela API (R1) |

## Item do pedido

| Campo | Regra |
|-------|-------|
| Produto | Produto ativo e existente (R7); no máximo uma linha por produto (R8) |
| Quantidade | Inteiro de 1 a 99 (R4) |
| Preço unitário | Copiado do produto **no momento da compra** (R2) |

## Relações

- Um pedido tem um ou mais itens; cada item pertence a um pedido.
- Cada item aponta para um produto. Um produto com itens não pode ser excluído,
  só desativado (R10).
