# Plano de referência — Sistema de pedidos

> **Para que serve este arquivo.** No workshop, o plano é gerado ao vivo a
> partir de [`product/business-rules.md`](product/business-rules.md) e salvo em
> `docs/plan.md`. Este arquivo é a rede de segurança: as skills leem
> `docs/plan.md` e, se ele não existir, usam este. Compare os dois depois; as
> diferenças são um bom exercício.

## Como ler

O trabalho é dividido em **issues** (um pedaço do produto) e **slices** (um
pedaço pequeno o bastante para uma conversa com o agente, um diff legível e um
commit). Cada slice tem:

- **Escopo**: o que entra e o que fica de fora.
- **Arquivos**: o que deve ser criado ou alterado. Mexer fora dessa lista é
  sinal de que o slice cresceu demais.
- **Pronto quando**: o critério objetivo para fazer o commit.
- **Casos extremos**: os códigos `E1`…`E17` de
  [`business-rules.md`](product/business-rules.md#casos-extremos), cada um com
  o teste que o cobre.

Ordem obrigatória: 1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 3.2 → 3.3. Cada slice
depende do anterior.

Todo slice termina com `make test` e `make lint` passando, o diff lido por
inteiro e um commit no formato `Add <o quê> (slice X.Y)`.

---

## Issue 1 — Produtos na API

### Slice 1.1 — Model `Product` + Admin

**Escopo**

- Criar o app Django `products` em `apps/api/apps/products/`.
- Model `Product`: `name` (texto, obrigatório), `price`
  (`DecimalField(max_digits=10, decimal_places=2)`), `is_active` (padrão
  `True`), `created_at`, `updated_at`.
- Preço maior que zero garantido em dois lugares: validador no campo (Admin
  mostra a mensagem) e `CheckConstraint` no banco.
- Admin: listagem com nome, preço e ativo; filtro por ativo; busca por nome;
  `is_active` editável na listagem.
- Fora: endpoint, serializer, qualquer coisa de pedido.

**Arquivos**

- `apps/api/apps/products/__init__.py`, `apps.py`, `models.py`, `admin.py`
- `apps/api/apps/products/migrations/0001_initial.py` (gerado por `makemigrations`)
- `apps/api/apps/products/tests/__init__.py`, `tests/test_product_model.py`
- `apps/api/config/settings.py` (adicionar `apps.products` em `INSTALLED_APPS`)

**Pronto quando**

- `make test` passa e o produto aparece em http://localhost:8000/admin/.
- Cadastrar um produto com preço `0` no Admin mostra erro e não salva.

**Casos extremos**

| Caso | Teste |
|------|-------|
| E13 preço zero ou negativo | `test_product_model.py::test_price_must_be_greater_than_zero` (validação) e `::test_database_rejects_non_positive_price` (constraint) |
| Padrão ativo | `test_product_model.py::test_new_product_is_active_by_default` |

### Slice 1.2 — `GET /api/products/`

**Escopo**

- Serializer com `id`, `name`, `price`. Preço sai como string com duas casas
  (`"12.50"`), que é o padrão do DRF para `DecimalField`.
- View que lista só produtos ativos, ordenados por nome.
- Rota `products/` incluída em `config/urls.py` sob `api/`.
- Fora: paginação, filtros, detalhe por id, escrita.

**Arquivos**

- `apps/api/apps/products/serializers.py`, `views.py`, `urls.py`
- `apps/api/config/urls.py`
- `apps/api/apps/products/tests/test_products_api.py`

**Pronto quando**

- `curl http://localhost:8000/api/products/` devolve só os produtos ativos.
- `make test` passa.

**Casos extremos**

| Caso | Teste |
|------|-------|
| E14 inativo não aparece | `test_products_api.py::test_lists_only_active_products` |
| Regra 9 preço como string decimal | `test_products_api.py::test_price_is_serialized_as_decimal_string` |
| Ordem estável | `test_products_api.py::test_products_are_ordered_by_name` |

---

## Issue 2 — Pedidos na API

### Slice 2.1 — Models `Order` e `OrderItem` + Admin com itens inline

**Escopo**

- Criar o app Django `orders` em `apps/api/apps/orders/`.
- `Order`: `customer_name`, `total` (`DecimalField` 10,2), `created_at`.
- `OrderItem`: `order` (FK, `CASCADE`), `product` (FK para `Product`,
  **`PROTECT`**), `quantity` (inteiro positivo, validadores de 1 a 99),
  `unit_price` (`DecimalField` 10,2).
- Admin de pedido com `OrderItem` em `TabularInline`, somente leitura (pedidos
  nascem pela API, não pelo Admin).
- Excluir um produto que tem pedidos é bloqueado pelo `PROTECT`. O Admin de
  produto deve mostrar a mensagem padrão do Django e o caminho é desativar.
- Fora: endpoint, serializer, cálculo de total (vem no 2.2).

**Arquivos**

- `apps/api/apps/orders/__init__.py`, `apps.py`, `models.py`, `admin.py`
- `apps/api/apps/orders/migrations/0001_initial.py`
- `apps/api/apps/orders/tests/__init__.py`, `tests/test_order_models.py`
- `apps/api/config/settings.py` (adicionar `apps.orders`)

**Pronto quando**

- Um pedido criado no shell aparece no Admin com os itens na mesma tela.
- Tentar excluir no Admin um produto com pedido mostra que ele está protegido.
- `make test` passa.

**Casos extremos**

| Caso | Teste |
|------|-------|
| E15 excluir produto com pedidos | `test_order_models.py::test_product_with_orders_cannot_be_deleted` |
| E2 preço unitário independente do produto | `test_order_models.py::test_item_keeps_its_own_unit_price` |

### Slice 2.2 — `POST /api/orders/` com todas as validações

**Escopo**

- Serializer de entrada: `customer_name` e `items` (`product_id`,
  `quantity`). Qualquer campo `total` enviado é ignorado.
- Regras de validação, todas rejeitando o pedido inteiro com `400`:
  nome vazio ou só espaços; lista vazia (depois de descartar quantidade zero);
  quantidade negativa, decimal ou maior que 99; produto inativo ou inexistente;
  produto repetido.
- Itens com quantidade `0` são descartados antes de validar o restante.
- Criação em `services.py` (`create_order`), dentro de `transaction.atomic()`:
  copia o preço atual do produto para `unit_price`, calcula o total com
  `Decimal` e grava pedido e itens juntos.
- Resposta `201` com `id`, `customer_name`, `total`, `created_at` e `items`
  (`product_id`, `product_name`, `quantity`, `unit_price`).
- Fora: listar ou consultar pedidos pela API, autenticação.

**Arquivos**

- `apps/api/apps/orders/serializers.py`, `services.py`, `views.py`, `urls.py`
- `apps/api/config/urls.py`
- `apps/api/apps/orders/tests/test_create_order_api.py`

**Pronto quando**

- `curl -X POST` com um pedido válido devolve `201` e o total certo.
- Cada caso extremo abaixo tem um teste passando.

**Casos extremos**

| Caso | Teste em `test_create_order_api.py` |
|------|-------------------------------------|
| Caminho feliz | `test_creates_order_with_items_and_total` |
| E1 total do cliente ignorado | `test_client_total_is_ignored` |
| E2 mudança de preço não altera pedido | `test_price_change_does_not_alter_existing_order` |
| E3 quantidade zero descartada | `test_zero_quantity_item_is_dropped` |
| E3b só itens zero | `test_only_zero_quantity_items_is_rejected` |
| E4 quantidade negativa | `test_negative_quantity_rejects_order` |
| E5 quantidade decimal | `test_decimal_quantity_rejects_order` |
| E6 quantidade acima de 99 | `test_quantity_above_99_rejects_order` |
| E7 limites 1 e 99 | `test_quantity_limits_are_accepted` |
| E8 sem itens | `test_empty_items_is_rejected` |
| E9 nome vazio ou espaços | `test_blank_customer_name_is_rejected` |
| E10 produto inativo | `test_inactive_product_rejects_order` |
| E11 produto inexistente | `test_unknown_product_rejects_order` |
| E12 produto repetido | `test_duplicated_product_rejects_order` |
| E16 centavos exatos | `test_total_uses_exact_decimal_math` |
| E17 nada gravado ao rejeitar | `test_rejected_order_saves_nothing` |

---

## Issue 3 — App web

### Slice 3.1 — Lista de produtos

**Escopo**

- Schema Zod do produto (`id`, `name`, `price` como string decimal).
- `fetchProducts()` chamando `GET /api/products/`.
- Componente `ProductList` com estados de carregando, erro (com "Tentar
  novamente") e lista vazia ("Nenhum produto disponível").
- Preço exibido em reais (`R$ 12,50`) por uma função de formatação.
- A home passa a mostrar a lista de produtos. O `HealthStatus` pode continuar na
  página, menor.
- Fora: quantidades, total, envio.

**Arquivos**

- `apps/web/src/lib/validation/schemas/products.ts`, `lib/validation/index.ts`
- `apps/web/src/lib/money/format-price.ts` + `format-price.test.ts`
- `apps/web/src/features/products/api/fetch-products.ts` + teste
- `apps/web/src/features/products/components/product-list.tsx` + teste
- `apps/web/src/app/page.tsx`

**Pronto quando**

- Com a API rodando, produtos cadastrados no Admin aparecem na home; desativar
  um no Admin e recarregar faz ele sumir.
- `make test` e `make lint` passam.

**Casos extremos**

| Caso | Teste |
|------|-------|
| Lista vazia | `product-list.test.tsx::shows empty state` |
| API fora do ar | `product-list.test.tsx::shows error state with retry` |
| Formato de preço | `format-price.test.ts::formats decimal string as BRL` |

### Slice 3.2 — Quantidades e total ao vivo

**Escopo**

- Cada produto ganha um campo de quantidade (inteiro de 0 a 99, começa em 0),
  com botões de − e +.
- Total ao vivo, calculado em **centavos inteiros** para não ter erro de float
  na tela (a API continua sendo a fonte do total gravado).
- Estado das quantidades em um hook `useOrderDraft` dentro de
  `features/orders/`.
- Fora: nome do cliente, envio.

**Arquivos**

- `apps/web/src/features/orders/lib/compute-total.ts` + teste
- `apps/web/src/features/orders/hooks/use-order-draft.ts`
- `apps/web/src/features/orders/components/quantity-input.tsx` + teste
- `apps/web/src/features/products/components/product-list.tsx` (usa o input)

**Pronto quando**

- Mudar quantidades atualiza o total na hora; o campo não aceita menos de 0 nem
  mais de 99.
- `make test` e `make lint` passam.

**Casos extremos**

| Caso | Teste |
|------|-------|
| E16 centavos no total da tela | `compute-total.test.ts::sums cents exactly` |
| E3 quantidade zero fora do total | `compute-total.test.ts::ignores zero quantities` |
| Limites 0 e 99 no input | `quantity-input.test.tsx::clamps between 0 and 99` |

### Slice 3.3 — Nome, envio, sucesso e erro

**Escopo**

- Campo "Seu nome" e botão "Enviar pedido".
- Botão desabilitado sem itens ou com nome vazio/só espaços (feedback rápido;
  a API valida de novo).
- `submitOrder()` com `useMutation`: envia só os itens com quantidade maior que
  zero e **nunca** envia total.
- Sucesso: mensagem com o número do pedido e o **total devolvido pela API**;
  o formulário é limpo.
- Erro `400`: mostra a mensagem da API (vinda de `ApiError.body`) sem perder o
  que a pessoa preencheu. Erro de rede: mensagem genérica.
- Fora: histórico de pedidos, login.

**Arquivos**

- `apps/web/src/lib/validation/schemas/orders.ts`, `lib/validation/index.ts`
- `apps/web/src/features/orders/api/submit-order.ts` + teste
- `apps/web/src/features/orders/components/order-form.tsx` + teste
- `apps/web/src/app/page.tsx`

**Pronto quando**

- Fluxo ponta a ponta: produto no Admin → pedido no app → pedido no Admin com
  itens e total certos.
- Mudar o preço no Admin depois não altera o pedido já feito.
- `make test` e `make lint` passam.

**Casos extremos**

| Caso | Teste |
|------|-------|
| E1 total nunca enviado | `submit-order.test.ts::payload has no total` |
| E3 zeros não enviados | `submit-order.test.ts::sends only items with quantity` |
| E9 nome em branco | `order-form.test.tsx::disables submit for blank name` |
| E8 sem itens | `order-form.test.tsx::disables submit without items` |
| Erro da API visível | `order-form.test.tsx::shows API validation error` |
| Total vem da API | `order-form.test.tsx::shows total returned by the API` |

---

## Mapa completo: caso extremo → teste

| Caso | Slice | Onde |
|------|-------|------|
| E1 | 2.2, 3.3 | `test_create_order_api.py`, `submit-order.test.ts` |
| E2 | 2.1, 2.2 | `test_order_models.py`, `test_create_order_api.py` |
| E3 | 2.2, 3.2, 3.3 | `test_create_order_api.py`, `compute-total.test.ts`, `submit-order.test.ts` |
| E3b | 2.2 | `test_create_order_api.py` |
| E4–E7 | 2.2 | `test_create_order_api.py` |
| E8 | 2.2, 3.3 | `test_create_order_api.py`, `order-form.test.tsx` |
| E9 | 2.2, 3.3 | `test_create_order_api.py`, `order-form.test.tsx` |
| E10–E12 | 2.2 | `test_create_order_api.py` |
| E13 | 1.1 | `test_product_model.py` |
| E14 | 1.2 | `test_products_api.py` |
| E15 | 2.1 | `test_order_models.py` |
| E16 | 2.2, 3.2 | `test_create_order_api.py`, `compute-total.test.ts` |
| E17 | 2.2 | `test_create_order_api.py` |
