---
name: create-slice
description: >-
  Turn one step of a plan into an executable slice: take the plan ID (Linear
  ticket such as GAM-12, or a local number such as 1) and the step number,
  read all the context, hunt for gaps and room for hallucination, ask the user
  until everything is resolved, then write the slice (description, acceptance
  criteria and the prompt to execute) as a Linear sub-issue and as a spec file
  under docs/history/slices/. Use when the user says create-slice,
  /create-slice, or wants to specify one step of a plan.
disable-model-invocation: true
---

# Create Slice

Writes one **slice**: a description, acceptance criteria, and the **prompt**
that `/execute-slice` will run. The prompt must be precise enough to implement
without guessing anything. Your main job is to find what is missing **before**
the code is written. No code here.

Write the slice in Brazilian Portuguese; talk to the user in their language.

## Input

Required:

1. **Plan ID**: Linear ticket (`GAM-12`) → Linear mode; local number (`1`) →
   local mode. Rules: `docs/workflow/modes.md`.
2. **Step number** in that plan (e.g. `1`).

## Slice IDs

| Mode | Slice ID | File |
|------|----------|------|
| Linear | The sub-issue identifier, e.g. `GAM-13` | `gam-13-<title>.md` |
| local | `<plan>.<step>`, e.g. `1.1` | `1.1-<title>.md` |

## Workflow

```
- [ ] Step 1: Load the plan and the step
- [ ] Step 2: Read all the context
- [ ] Step 3: Gap check
- [ ] Step 4: Questions until no gap is left
- [ ] Step 5: Write the draft and confirm
- [ ] Step 6: Register the slice
- [ ] Step 7: Output
```

### Step 1 — Load the plan and the step

1. Open `docs/history/plans/<id>-*.md` (lowercase id). Missing: **stop** and
   say so.
2. Find the step. Missing: **stop** and list the steps that exist.
3. If the step already has a slice, **stop** and ask: keep it, or replace it?
   (Linear mode: the old sub-issue stays unless the user asks to cancel it.)

### Step 2 — Read all the context

Read, do not assume:

- The whole plan: goal, decisions, out of scope, the other steps.
- Every file in the product folder linked in the plan header
  (`docs/product/<project>/`).
- `docs/architecture/project-standards.md` and `.cursor/rules/code-quality.mdc`.
- The slices of earlier steps, including their "Execuções" sections.
- The code the step will touch or depend on: open the real files. The
  reference examples of the pattern are `apps/api/apps/core/` and
  `apps/web/src/features/health/`.
- **Linear mode:** the plan ticket and its comments (MCP `linear`), for
  anything added after the plan.

### Step 3 — Gap check

Go through this list and write down every hit. A hit is anything the executing
agent would have to **decide or invent**:

1. A rule the step needs that the product docs do not state, or state in a way
   that can be read two ways.
2. Product docs, plan and code disagreeing.
3. A file, function, endpoint or pattern the step assumes exists but does not.
4. An edge case with no defined behavior (empty, zero, negative, duplicate,
   limit, missing related record, change after the fact).
5. Names that are not defined anywhere: fields, endpoints, JSON shapes, error
   messages, UI text.
6. An acceptance criterion that cannot be checked.
7. A step too big for one conversation: propose how to split it.
8. A dependency on an earlier step that is not executed yet.

### Step 4 — Questions

If there are hits, ask about them: numbered, at most 5 per round, most
blocking first, each with the answer you would suggest and why. Use the
AskQuestion tool for discrete choices. Repeat Steps 3–4 with the answers until
the list is empty.

When an answer defines a **business rule**, tell the user and offer to record
it in `docs/product/<project>/` (rule file and `decisions.md`) now, with their
confirmation, so the product docs stay the source of truth.

If there are no hits, say so in one line and continue.

### Step 5 — Write the draft and confirm

Fill `docs/templates/slice.md` completely:

- **Descrição**: what the slice delivers and why, in two to four sentences.
- **Critérios de aceite**: checkable items, each tied to a rule or edge case
  ID, plus `make test` and `make lint`.
- **Prompt**: every block of the template filled: objective, files to read,
  context with verified paths, scope, out of scope, files, rules mapped to
  named tests, restrictions, done-when, output. The prompt must stand alone:
  an agent that reads only the prompt and the files it lists has everything it
  needs.
- **Decisões tomadas na especificação**: every question with its answer.

Show the output summary (marked as a draft) and the full Prompt block, then
wait for **explicit confirmation**.

### Step 6 — Register the slice

After confirmation:

1. **Linear mode:** create the issue in the same team and project as the plan
   ticket, with `parentId` set to the plan ticket. Title: the slice title.
   Description: the sections `## Descrição`, `## Critérios de aceite` and
   `## Prompt` exactly as in the spec, plus a last line with the spec file
   path. Get the identifier and URL; then put them in the Prompt's first lines
   (and update the issue if it changed). If the MCP fails, never invent an ID:
   ask whether to retry or continue in local mode.
   **Local mode:** the slice ID is `<plan>.<step>`.
2. Write `docs/history/slices/<slice-id>-<title-kebab>.md`, status
   `especificado`.
3. In the plan file, set the step's `Slice:` line to a link to the spec and add
   a Histórico line.
4. Add a row to `docs/history/slices/README.md`.

## Output

Always end with this format:

```markdown
## Slice <ID> — <title>

**Plan:** <plan ID> — <plan title>, Step <n>
**Linear:** <url> (sub-issue of <plan ID>) | local
**Spec:** docs/history/slices/<file>.md

**Delivers:** <one or two sentences>

**Scope**
- …

**Out of scope**
- …

**Files**
- `path` — create | change — why

**Rules and edge cases → tests**
- R2 / E4 — expected behavior — `test_name`

**Decisions made in this conversation**
- <question> → <answer> (or "none")

**Done when**
- …

**Next step:** `/execute-slice <ID>`
```

## Anti-patterns

- Filling a gap with a "reasonable assumption" instead of asking.
- Copying the step from the plan without opening the code it touches.
- A prompt that depends on this conversation ("as discussed above").
- A spec with "etc.", "and so on", or tests without names.
- Linear description and spec file with different prompts.
- Creating the sub-issue before the user confirms.
- Writing code.
