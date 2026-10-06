---
name: continue-project
description: >-
  Continue the discovery of a project that already has docs/product/<project>/:
  take the Linear project URL (or the project name, without Linear) plus the
  new context, analyze the impact on rules, plans and slices, interview the
  user, save only the confirmed definitions and offer to update the Linear
  project description. Use when the user says continue-project,
  /continue-project, or wants to change or extend the rules of a project.
disable-model-invocation: true
---

# Continue Project

Same discovery as `start-project` (read `.cursor/skills/start-project/SKILL.md`
for the round mechanics and file formats), for a project that already exists
and needs changes or new discoveries. You start from what is documented, and
every change is checked against what was already planned or built.

Write every file in Brazilian Portuguese. Talk to the user in their language.

## Input

Required, one of:

- **Linear project URL** (or exact Linear project name) → Linear mode.
- **Project name** or folder in `docs/product/` → local mode.

Optional: **context of the change** (what is new, what changed, why).

Mode rules: `docs/workflow/modes.md`.

## Workflow

```
- [ ] Step 1: Load what exists
- [ ] Step 2: Understand the change
- [ ] Step 3: Impact analysis
- [ ] Step 4: Discovery rounds (repeat)
- [ ] Step 5: Output
```

### Step 1 — Load what exists

1. **Linear mode:** read the project with the `linear` MCP server (fallback
   rules in `docs/architecture/linear-mcp.md`).
2. Find the project folder: the folder in `docs/product/` whose `README.md`
   links to this Linear project, or whose name is the project name in
   kebab-case. If none exists, **stop** and suggest `/start-project`.
3. Read every file in that folder, including `decisions.md` and
   `open-questions.md`.
4. Read the plans of this project in `docs/history/plans/` and their slices in
   `docs/history/slices/` (status: specified or executed).

Give the user a short status: what is defined, open questions, plans, slices.

### Step 2 — Understand the change

Classify what the user brought, and confirm the classification:

- **New discovery**: something not documented yet.
- **Rule change**: a confirmed rule, entity or edge case changes.
- **Correction**: the documentation was wrong about what had been decided.
- **Answer to an open question** from `open-questions.md`.

### Step 3 — Impact analysis

For each change, list before asking anything else:

- Rules, entities and edge cases affected (by ID).
- Plans and steps that relied on the old definition.
- Slices **specified** but not executed that would now be wrong.
- Slices **executed**: the code that implements the old behavior (cite paths).

Show this list to the user. It is often the most valuable result of the skill.

### Step 4 — Discovery rounds

Follow Step 4 of `start-project`, with these rules:

- A changed rule keeps its ID. Record the change in `decisions.md` (create it
  if needed) as a new `DEC-<n>` that says what it replaces, with the reason.
- Never delete history: an old decision stays, marked as replaced.
- Answered open questions move out of `open-questions.md` into the right file.
- Update `Última atualização` in the project README.
- **Linear mode — always ask** at the end of each round whether to update the
  Linear project description, showing the exact text first.

### Step 5 — Output

Do not change plans, slices or code yourself. Point to `/continue-plan` and
`/create-slice` for that.

## Output

Always end with:

```markdown
## Discovery update — <project>

**Mode:** Linear | local
**Linear:** <url> — description updated: yes | no   (Linear mode only)

**Changes**
- R3 changed: <before> → <after> (DEC-007)

**Impact**
- Plans to review: <ID — what changes> (`/continue-plan <ID>`)
- Specified slices now outdated: <ID — why>
- Executed code that no longer matches: <path — behavior>

**Still open:** <list or "nothing">

**Files written**
- `path` — what changed
```

## Anti-patterns

- Rewriting a rule silently, without a `decisions.md` entry.
- Skipping the impact analysis because the change "looks small".
- Editing plans, slices or code from this skill.
- Writing to Linear without approval.
