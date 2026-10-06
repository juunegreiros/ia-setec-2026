# Contrato da API — Sistema de pedidos

## Endpoints

| Método | Caminho | O que faz |
|--------|---------|-----------|
| `GET` | `/api/products/` | Lista **só** os produtos ativos (R7) |
| `POST` | `/api/orders/` | Valida e cria um pedido |

## Formato sugerido do `POST /api/orders/`

```json
{
  "customer_name": "Ana",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

## Respostas esperadas

- `201 Created` com o pedido gravado, incluindo o `total` calculado e o preço
  unitário de cada item.
- `400 Bad Request` com a mensagem de erro de validação, sem gravar nada (R11).

Preços trafegam como string decimal, ex.: `"12.50"` (R9).
