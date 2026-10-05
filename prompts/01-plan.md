# Planning prompt

Use once, before any code. In Cursor, run it in **Plan mode**. In a browser
chat, paste it and then paste the two documents listed under "Read first".

```text
You are planning a small order system that will be built slice by slice with
an AI agent. Do not write any code. Your output is a plan document only.

READ FIRST
- docs/product/business-rules.md — what the system must do (source of truth)
- docs/architecture/project-standards.md — how the code is organized
- The existing code in apps/api/apps/core and apps/web/src/features/health,
  which shows the patterns to follow
(In a browser chat, these are pasted below this prompt.)

WHAT TO PRODUCE
A markdown document to be saved as docs/plan.md, in Brazilian Portuguese,
with exactly three issues and these slices:

Issue 1, Products in the API: 1.1 Product model + Admin; 1.2 GET /api/products/.
Issue 2, Orders in the API: 2.1 Order and OrderItem models + Admin with
inline items; 2.2 POST /api/orders/ with all validations.
Issue 3, Web app: 3.1 product list; 3.2 quantities and live total; 3.3 name
field, submit, success and error states.

For every slice include:
- Scope: what is in, and explicitly what is out.
- Files: every file created or changed, with its path.
- Done when: an objective check a person can run (a command, a click path).
- Edge cases: each edge case code from business-rules.md (E1, E2, …) that the
  slice covers, with the name of the test that covers it.

End with a table mapping every edge case in business-rules.md to its slice and
test file. Every edge case must appear at least once.

RULES
- Follow project-standards.md for folders and naming.
- A slice must be small enough for one conversation, one readable diff and one
  commit. If a slice looks too big, say so instead of silently splitting it.
- Do not invent rules that are not in business-rules.md. If a rule is
  ambiguous, list it under "Open questions" at the end, with the option you
  would choose and why.
```
