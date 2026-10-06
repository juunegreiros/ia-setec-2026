---
name: start-project
description: >-
  Model a new project like a SPIKE: take a Linear project URL (or a project
  name, without Linear) plus any initial context, interview the user to
  discover the business rules, save only the confirmed definitions under
  docs/product/<project>/, and offer to update the Linear project description
  after every round. Use when the user says start-project, /start-project, or
  wants to start modeling a new project.
disable-model-invocation: true
---

# Start Project

A **discovery** for a new project, run like a SPIKE ticket: the output is
decisions and documentation, never code. You lead with questions; the user
decides. Nothing becomes a rule until the user confirms it.

Write every file in Brazilian Portuguese. Talk to the user in their language.

## Input

Required, one of:

- **Linear project URL** (or exact Linear project name) → Linear mode.
- **Project name** with "sem Linear" → local mode.

Optional: **initial context** (the idea, who uses it, constraints, links).

If neither is given, ask. Mode rules: `docs/workflow/modes.md`.

## Workflow

```
- [ ] Step 1: Read the project
- [ ] Step 2: Check the product folder
- [ ] Step 3: Opening questions
- [ ] Step 4: Discovery rounds (repeat)
- [ ] Step 5: Close the discovery and give the output
```

### Step 1 — Read the project

- **Linear mode:** read the project's name, description, teams and issues with
  the `linear` MCP server (rules: `docs/architecture/linear-mcp.md`). If the
  MCP does not answer, say so and ask: connect it and retry, or continue in
  local mode. Never invent Linear data.
- **Local mode:** use the name and the context the user gave.

### Step 2 — Check the product folder

1. Folder name: the project name in kebab-case, lowercase, no accents
   (`Workshop-setec` → `workshop-setec`). Tell the user and let them change it.
2. If a folder in `docs/product/` already has this name, or its `README.md`
   already links to this Linear project, **stop** and suggest
   `/continue-project`.
3. Read `docs/product/business-rules.md` (the product index) and
   `docs/templates/product-readme.md`.

Do not create the folder yet: it is created on the first confirmed save.

### Step 3 — Opening questions

Summarize in a few lines what you understood. Then ask the first round. Cover
what is still unknown among:

- **Problem and users**: what problem, for whom, what they do today.
- **Scope**: what is in the first version, what is explicitly out.
- **Entities**: the main "things" of the system and their key data.
- **Rules**: what is allowed, forbidden, calculated, validated.
- **Edge cases**: empty, zero, negative, duplicate, limits, concurrency, changes
  after the fact (e.g. price changes after an order).
- **Constraints**: deadlines, technology, integrations, who administers.

At most 5 questions per round, numbered. For each, give the option you would
suggest and why, so the user can answer "ok". Use the AskQuestion tool when
the answers are discrete choices.

### Step 4 — Discovery rounds

Repeat until the user says the discovery is enough for now:

1. Separate **confirmed** from **still open**. A suggestion the user did not
   explicitly accept is still open.
2. Show a short round summary: confirmed, still open, and any contradiction
   with earlier answers (ask which one wins).
3. Save the confirmed definitions. On the first save, create the folder and
   add a row for the project to the table in `docs/product/business-rules.md`.

   | File | Gets |
   |------|------|
   | `README.md` | From `docs/templates/product-readme.md`: one-sentence summary, scope, Linear link (or "—"), file index |
   | `business-rules.md` | Numbered rules `R1`, `R2`… One rule per item, testable wording |
   | `domain-model.md` | Entities, fields (type, required, limits), relations |
   | `edge-cases.md` | `E1`, `E2`… with the expected behavior and the rule it belongs to |
   | `decisions.md` | `DEC-001`… with date, decision, reason, origin (`start-project`) |
   | `open-questions.md` | Everything still open, numbered |

   Create a file only when it has content, and keep the README index in sync.
4. **Linear mode — always ask:** "Quer que eu atualize a descrição do projeto
   no Linear com o que foi confirmado até agora?" If yes, show the exact text
   (summary, scope, main rules, out of scope, path to `docs/product/<project>/`)
   and write it only after approval. If the current description has content
   the user wants to keep, use a partial edit instead of replacing it.
5. Ask the next round, most blocking first.

### Step 5 — Close and output

Set `Discovery` in the README to `concluído` or keep `em andamento`, as the
user prefers. Then give the output.

## Output

Always end with:

```markdown
## Discovery — <project>

**Mode:** Linear | local
**Linear:** <url> — description updated: yes | no   (Linear mode only)
**Folder:** docs/product/<project>/

**Confirmed:** N rules, N entities, N edge cases, N decisions
**Still open:** <numbered list, or "nothing">

**Files written**
- `path` — what it contains

**Next step:** `/start-new-plan <project URL or name> "<plan title>"` to plan
the first delivery, or `/continue-project <project URL or name>` to keep
discovering.
```

## Anti-patterns

- Writing a rule the user did not confirm, or "completing" gaps with guesses.
- Writing code, models or migrations. This skill only produces documentation.
- Writing to Linear without showing the text and getting approval.
- Asking 15 questions at once. Small rounds, most blocking first.
- Deleting a rule when the user changes their mind: replace it and log the
  change in `decisions.md`.
