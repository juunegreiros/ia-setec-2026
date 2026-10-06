---
name: create-slices
description: >-
  Create the slices for every step of a plan as an orchestrator: take the plan
  ID (Linear ticket such as GAM-12, or a local number such as 1), let one
  read-only subagent analyze each step and return a draft plus its gaps, ask
  the user all the questions, then write each slice (description, acceptance
  criteria, prompt) as a Linear sub-issue or local slice 1.1, 1.2… and as a
  spec under docs/history/slices/, in step order. Use when the user says
  create-slices, /create-slices, or wants to specify a whole plan.
disable-model-invocation: true
---

# Create Slices

Same result as running `/create-slice` for every step without a slice, but as
an **orchestrator**: subagents do the reading and analysis, you talk to the
user, check consistency between steps, and write the results.

Read `.cursor/skills/create-slice/SKILL.md` first: its slice IDs, gap check,
slice format (Descrição, Critérios de aceite, Prompt) and output format apply
here unchanged.

Key idea: a subagent does **not** see this conversation. It only sees the
instruction you write, and only its report comes back. Subagents also cannot
ask the user anything, so all questions come back to you. Subagents only
analyze; the slices are executed later by `/execute-slice`, in a normal
conversation.

## Input

Required: **plan ID** — Linear ticket (`GAM-12`) → Linear mode; local number
(`1`) → local mode. Rules: `docs/workflow/modes.md`.

## Workflow

```
- [ ] Step 1: Load the plan and list the steps
- [ ] Step 2: One analysis subagent per step
- [ ] Step 3: Consolidate and check consistency
- [ ] Step 4: Questions until no gap is left
- [ ] Step 5: Confirm all the slices
- [ ] Step 6: Register the slices, in step order
- [ ] Step 7: Output
```

### Step 1 — Load the plan

Open `docs/history/plans/<id>-*.md`. List the steps that have no slice yet,
and the ones that already have one (they are skipped). Show the list and wait
for a go-ahead.

### Step 2 — One analysis subagent per step

Start one subagent per step (in Cursor, the Task tool). They only read, so they
can run in parallel. Print each instruction in the chat before starting it.
Instruction template:

```text
You are analyzing one step of a plan in this repository, to prepare its slice.
Do not write or edit any file. Do not call Linear.

Plan file: docs/history/plans/<file>.md — Step <n>: <title>

1. Read .cursor/skills/create-slice/SKILL.md (Steps 2, 3 and 5 only).
2. Read the plan, the product docs linked in its header,
   docs/architecture/project-standards.md, .cursor/rules/code-quality.mdc and
   the code this step touches.
3. The earlier steps of the plan may not be implemented yet. Rely only on what
   the plan says they deliver; anything else you need from them is a gap.
4. Run the gap check from create-slice Step 3.

Reply with exactly two sections:
## Draft slice
The full slice filled from docs/templates/slice.md (Descrição, Critérios de
aceite, Prompt). Leave the slice ID as "<ID>".
## Gaps
Numbered. For each: the question, the option you suggest, and why.
Write "None" if there are no gaps.
```

### Step 3 — Consolidate and check consistency

When all reports are back, print them, then check across steps:

- Two steps creating or changing the same file in conflicting ways.
- A step using something (field, endpoint, component) that no earlier step
  creates.
- The same question asked by several subagents: merge it into one.
- Edge cases of the plan covered by no step, or by two.

### Step 4 — Questions

Ask the user all open gaps, grouped by step, at most 5 per round, each with
the suggested answer. Business rules: offer to record them in
`docs/product/<project>/` (as in create-slice Step 4). Update the drafts
yourself with the answers. Repeat until no gap is left.

### Step 5 — Confirm

Show one table, then each draft in the create-slice output format:

```markdown
| Step | Slice title | Files | Tests | Decisions |
|------|-------------|-------|-------|-----------|
```

Wait for **explicit confirmation** of all slices, or of the subset the user
approves.

### Step 6 — Register, in step order

Strictly one step at a time, in order, so ticket numbers follow the steps. For
each, do create-slice Step 6:

- **Linear mode:** sub-issue with `parentId` = plan ticket and the description
  made of Descrição, Critérios de aceite and Prompt.
- **Local mode:** slice ID `<plan>.<step>` (`1.1`, `1.2`…).
- In both: spec file in `docs/history/slices/`, `Slice:` line and Histórico in
  the plan file, row in `docs/history/slices/README.md`.

If one fails, stop and report what was created so far.

## Output

Always end with:

```markdown
## Plano <ID> — slices created

**Mode:** Linear | local

| Step | Slice | Linear | Spec |
|------|-------|--------|------|
| 1 | <title> | <ID or "local"> | docs/history/slices/<file>.md |

**Decisions made in this conversation:** <list or "none">
**Skipped (already had a slice):** <list or "none">

**Next step:** `/execute-slice <first slice ID>`, one slice at a time, in order.
```

Then, for each slice, the create-slice output.

## Anti-patterns

- Letting a subagent write files or call Linear.
- Passing a subagent an instruction that depends on this conversation.
- Registering slices before every gap is answered and the user confirms.
- Registering slices out of order or in parallel.
- Skipping the cross-step consistency check.
