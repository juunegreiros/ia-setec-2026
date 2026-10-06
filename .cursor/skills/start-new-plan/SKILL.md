---
name: start-new-plan
description: >-
  Create a delivery plan for a project: take the Linear project URL (or the
  project name, without Linear), the plan title and any context, compare the
  business rules in docs/product/<project>/ with the current application,
  close the gaps with the user, split the work into steps, create the plan
  ticket in Linear (or a local plan number) and save it under
  docs/history/plans/. Use when the user says start-new-plan, /start-new-plan,
  or wants to plan a new feature or delivery.
disable-model-invocation: true
---

# Start New Plan

Turns "what the product needs" into an ordered list of **steps**. Each step
later becomes a slice with `/create-slice` or `/create-slices`. In Linear mode
a plan is a **ticket** and its slices will be **sub-issues**; in local mode it
is a numbered file.

No code is written here. Write the plan in Brazilian Portuguese; talk to the
user in their language.

## Input

Required:

1. **Project**: Linear project URL (Linear mode) or project name / folder in
   `docs/product/` (local mode).
2. **Plan title**, e.g. "Pedidos na API".

Optional: **initial context** (goal, priority, constraints, what to leave out).

Mode rules: `docs/workflow/modes.md`.

## Workflow

```
- [ ] Step 1: Read the product
- [ ] Step 2: Read the application
- [ ] Step 3: Compare product × application
- [ ] Step 4: Questions until the scope is clear
- [ ] Step 5: Draft the steps and confirm
- [ ] Step 6: Register the plan (Linear ticket or local number)
- [ ] Step 7: Save the plan file and give the output
```

### Step 1 — Read the product

1. **Linear mode:** read the project with the `linear` MCP server (fallback
   rules in `docs/architecture/linear-mcp.md`). Note its team: the plan ticket
   goes there. If the project has more than one team, ask which one.
2. Find the project folder: the one whose `README.md` links to this Linear
   project, or whose name is the project name in kebab-case. If none exists,
   **stop** and suggest `/start-project`.
3. Read every file in that folder.
4. Read the existing plans of this project in `docs/history/plans/`, to avoid
   overlapping or duplicating them.

### Step 2 — Read the application

Read, do not assume:

1. `docs/architecture/project-standards.md` and `.cursor/rules/code-quality.mdc`.
2. What exists in the code: Django apps in `apps/api/apps/` (models, urls,
   serializers, tests) and features in `apps/web/src/features/` and
   `apps/web/src/app/`.
3. Executed slices in `docs/history/slices/` (section "Execuções").

### Step 3 — Compare product × application

Build the table "O que existe hoje" of `docs/templates/plan.md`: for each
entity, rule or screen the plan involves, is it defined in the product docs,
and does it exist in the code (with the path)? Flag:

- Defined in the product but missing in the code: candidate work.
- In the code but not in the product docs: ask whether it is intended.
- Code that contradicts a rule: ask which one is right.
- Rules the plan needs that the product docs do not define: these go to the
  user, and possibly to `/continue-project`.

### Step 4 — Questions

Ask until the plan is unambiguous: goal, out of scope, priority among
candidates, order, dependencies. At most 5 questions per round, numbered, each
with your suggestion and why. If an answer is a **business rule**, say so and
suggest recording it with `/continue-project`; the plan references rules, it
does not define them.

### Step 5 — Draft the steps and confirm

Split the work into steps that follow the order of dependencies. A good step:

- delivers something testable on its own;
- fits in one agent conversation (one layer or one feature slice, a handful of
  files);
- names the rules and edge cases (by ID) it covers;
- states which earlier step it depends on.

Show a self-contained draft: goal, what exists today, out of scope, decisions,
steps. Wait for **explicit confirmation**. If the user asks for changes, revise
and confirm again.

### Step 6 — Register the plan

- **Linear mode:** create the issue in the project's team, linked to the
  project, with the plan title. Description, in Portuguese: goal, numbered
  steps (one line each), out of scope, and the path of the plan file. Get the
  identifier (e.g. `GAM-12`) and URL. If the MCP fails, never invent an ID:
  ask whether to retry or continue in local mode.
- **Local mode:** the plan ID is the next free number in
  `docs/history/plans/` (largest `<n>-*.md` plus one; the first is `1`).

### Step 7 — Save the plan file

1. Write `docs/history/plans/<id>-<title-kebab>.md` (lowercase id, title
   without accents) from `docs/templates/plan.md`, status `aprovado`, every
   step with `Slice: ainda não criado`, and a first Histórico entry.
2. Add a row to the index in `docs/history/plans/README.md` and to the "Planos
   deste projeto" table in the project README.

## Output

Always end with:

```markdown
## Plano <ID> — <title>

**Mode:** Linear | local
**Linear:** <url>   (Linear mode only)
**File:** docs/history/plans/<file>.md

**Goal:** <one sentence>

| Step | Delivers | Depends on |
|------|----------|------------|
| 1 | … | — |

**Decisions made:** <list or "none">
**Out of scope:** <list>

**Next step:** `/create-slice <ID> 1` for one step, or `/create-slices <ID>`
for all of them.
```

## Anti-patterns

- Planning from memory without reading the code.
- Defining business rules inside the plan instead of in `docs/product/`.
- Steps that are too big ("build the web app") or not testable alone.
- Registering the plan before the user confirms it.
- Writing code.
