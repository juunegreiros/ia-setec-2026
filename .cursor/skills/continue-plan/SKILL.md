---
name: continue-plan
description: >-
  Continue a plan that is already under way: take the plan ID (Linear ticket
  such as GAM-12, or a local number such as 1), read everything that exists,
  summarize what was done and what is left, look for inconsistencies between
  plan, slices, product docs, code and Linear, then ask about changes and
  apply the confirmed ones. Use when the user says continue-plan,
  /continue-plan, or wants to resume, check or change a plan.
disable-model-invocation: true
---

# Continue Plan

Picks up a plan created by `start-new-plan`: reads what exists, says what was
done and what is left, finds what does not add up, and only then asks about
changes. Write in Brazilian Portuguese; talk to the user in their language.

## Input

Required: **plan ID** — Linear ticket (`GAM-12` or its URL) or local plan
number (`1`). Mode rules: `docs/workflow/modes.md`.

Optional: **what changed** (new information, a step to add, a scope cut).

## Workflow

```
- [ ] Step 1: Read everything that exists
- [ ] Step 2: Summarize done and left
- [ ] Step 3: Look for inconsistencies
- [ ] Step 4: Ask about changes
- [ ] Step 5: Confirm and apply
- [ ] Step 6: Output
```

### Step 1 — Read everything that exists

1. The plan file `docs/history/plans/<id>-*.md` (lowercase id). If it does not
   exist, **stop** and suggest `/start-new-plan`.
2. Every slice of the plan in `docs/history/slices/`: spec, decisions and
   "Execuções".
3. The product folder linked in the plan header.
4. The code each executed slice changed (paths in its "Execuções").
5. **Linear mode:** the plan ticket, its sub-issues (status, comments) and the
   project, with the `linear` MCP server. If it does not answer, say so and
   continue with the local files.

### Step 2 — Summarize done and left

```markdown
| Step | Title | Slice | Status |
|------|-------|-------|--------|
| 1 | … | GAM-13 | executed on 2026-10-06 — tests passed |
| 2 | … | GAM-14 | specified, not executed |
| 3 | … | — | no slice yet |
```

Below the table, in two or three sentences: what already works, what is left,
and the next step in the order of dependencies.

### Step 3 — Look for inconsistencies

Check and list everything that does not add up:

- **Plan × slices:** a step without the slice it points to; a slice whose spec
  no longer matches its step; steps executed out of dependency order.
- **Slices × code:** an executed slice whose files or tests are not in the code
  anymore; a failed or partial execution never resolved.
- **Product × plan:** rules or edge cases changed in `docs/product/` (see
  `decisions.md`) after the plan or a spec was written; plan edge cases covered
  by no step.
- **Linear × files** (Linear mode): sub-issues with no step, a step pointing to
  a missing ticket, a ticket marked done whose slice has no successful
  execution, a Prompt in Linear that differs from the spec file.

If nothing is inconsistent, say so in one line.

### Step 4 — Ask about changes

Ask what the user wants to do, starting with how to resolve each inconsistency
(each with your suggestion), then any change they brought: add, remove,
reorder or rescope steps, record a decision, close the plan. At most 5
questions per round.

If a change is really a **business rule** change, say so and suggest
`/continue-project` first. Apply these limits by step status:

| Step status | Allowed change |
|-------------|----------------|
| No slice yet | Change freely |
| Specified (not executed) | Change the step, and mark the slice spec as outdated: suggest recreating it with `/create-slice` |
| Executed | Do **not** rewrite it. Add a new step that changes the behavior |

If a removed step has a sub-issue, ask whether to cancel it in Linear. Never
change a ticket's status without the user's explicit approval.

### Step 5 — Confirm and apply

Show the updated step list and the exact Histórico entry. After **explicit
confirmation**:

1. Update the plan file and add a Histórico line: date, what changed, why.
2. Update the plan Status if it changed (`em execução`, `concluído`).
3. **Linear mode:** update the ticket description so the step list matches.
4. Update the row in `docs/history/plans/README.md`.

If the user only wanted the summary, skip this step.

## Output

Always end with:

```markdown
## Plano <ID> — status

**Mode:** Linear | local
**Done:** <steps and slices executed>
**Left:** <steps not executed, in order>

**Inconsistencies found:** <list with how each was resolved, or "none">
**Changes applied:** <list, or "none">
**Outdated slices to recreate:** <list or "none">
**Linear:** description updated: yes | no — status changes: <list or "none">

**Next step:** <`/execute-slice <ID>`, `/create-slice <plan ID> <n>`, …>
```

## Anti-patterns

- Asking about changes before summarizing what exists.
- Rewriting an executed step instead of adding a new one.
- Editing or deleting old Histórico entries.
- Changing business rules here instead of in `docs/product/`.
- Updating the file and forgetting Linear, or the other way around.
- Changing ticket statuses without approval.
