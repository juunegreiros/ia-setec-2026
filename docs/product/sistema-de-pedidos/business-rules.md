# Regras — Sistema de pedidos

Fonte de verdade do **que** o sistema faz. Código, plano e testes derivam
daqui; se uma regra mudar, ela muda primeiro neste arquivo. Entidades em
[domain-model.md](./domain-model.md), casos extremos em
[edge-cases.md](./edge-cases.md).

1. **R1 — O total é sempre calculado pela API.** Se o cliente enviar um total,
   ele é ignorado. O total é a soma de `preço unitário × quantidade` de cada
   item.
2. **R2 — Cada item guarda o preço unitário do momento da compra.** Mudar o
   preço do produto depois nunca altera pedidos já feitos.
3. **R3 — Item com quantidade zero não faz parte do pedido.** O app não envia
   produtos com quantidade zero. Se a API receber um item com quantidade zero,
   ela o descarta (não rejeita o pedido por isso). Se todos os itens forem
   zero, o pedido fica sem itens e cai na R5. *Ver a dúvida 1 em
   [open-questions.md](./open-questions.md).*
4. **R4 — A quantidade de um item gravado é um inteiro de 1 a 99.** Valor
   negativo, decimal ou maior que 99 rejeita o pedido **inteiro**, não só o
   item.
5. **R5 — Pedido sem itens é rejeitado.**
6. **R6 — Nome do cliente vazio ou só com espaços é rejeitado.**
7. **R7 — Produto inativo ou inexistente** não aparece na listagem e, se for
   enviado em um pedido, rejeita o pedido.
8. **R8 — O mesmo produto duas vezes no mesmo pedido rejeita o pedido.** O app
   manda uma linha por produto.
9. **R9 — Dinheiro usa Decimal com duas casas, nunca float.** Isso vale para o
   banco, para os cálculos e para o JSON (preços trafegam como string, ex.:
   `"12.50"`).
10. **R10 — Produto que já tem pedidos não pode ser excluído;** ele é
    desativado.
11. **R11 — Pedido rejeitado não grava nada:** nem o pedido, nem parte dos
    itens.
