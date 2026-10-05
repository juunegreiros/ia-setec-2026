---
name: execute-slice
description: >-
  Implement exactly one slice of the order system plan (for example 1.1 or 2.2):
  read the business rules, project standards and the slice, ask about
  ambiguities, implement only that slice, run the tests and report. Use when the
  user says execute-slice, /execute-slice, or asks to run a slice by its id.
disable-model-invocation: true
---

# Execute Slice

Implements **one** slice of the plan, and nothing else. The human stays in
control: when in doubt, ask; never expand the scope.

## Input

Required: **slice id**, such as `1.1`, `2.2` or `3.3`.

If the id is missing or does not exist in the plan, stop and ask for it.

## Workflow

```
- [ ] Step 1: Read the rules and standards
- [ ] Step 2: Find the slice in the plan
- [ ] Step 3: Check prerequisites
- [ ] Step 4: Ask about anything ambiguous
- [ ] Step 5: Implement only the slice
- [ ] Step 6: Run the tests
- [ ] Step 7: Report
```

### Step 1 — Read the rules and standards

Read in full:

1. `docs/product/business-rules.md`
2. `docs/architecture/project-standards.md`
3. The reference examples of the pattern: `apps/api/apps/core/` on the API side
   and `apps/web/src/features/health/` plus `apps/web/src/lib/` on the web side.

### Step 2 — Find the slice

1. Open `docs/plan.md`. If it does not exist, open `docs/plan.reference.md` and
   say in the report that the reference plan was used.
2. Locate the slice by id. Extract: **scope**, **out of scope**, **files**,
   **done when** and **edge cases** with their test names.

### Step 3 — Check prerequisites

Slices run in order (1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 3.2 → 3.3). Confirm the
previous slice exists in the code (for example, 1.2 needs the `Product` model
from 1.1). If it does not, stop and tell the user which slice is missing.

### Step 4 — Ask before guessing

Stop and ask the user if:

- the slice and the business rules disagree;
- a rule needed by the slice is missing or can be read two ways;
- the slice needs a file that is not in its file list.

List the questions together, each with the option you would choose and why.
If nothing is ambiguous, say so in one line and continue.

### Step 5 — Implement only the slice

- Create or change only the files listed in the slice.
- Follow `project-standards.md` and the reference examples.
- Write every test named in the slice's edge case table, with those names.
- Generate Django migrations with `makemigrations`; never write them by hand.
- Do not commit. Do not start the next slice.

### Step 6 — Run the tests

From the repository root:

```bash
make test
make lint
```

Without make: `cd apps/api && .venv/bin/python manage.py test` (on Windows,
`.venv\Scripts\python manage.py test`) and
`cd apps/web && npm test && npm run lint && npm run typecheck`.

If a test fails, read the full error, fix the cause and run again. If it still
fails after two attempts, stop and report the failure with the full error.

### Step 7 — Report

Reply with exactly these sections:

```markdown
## Slice X.Y — <title>

**Plan used:** docs/plan.md | docs/plan.reference.md

**Files changed**
- `path` — why

**Tests run**
- `make test` — N passed / M failed
- `make lint` — clean | errors

**Edge cases covered**
- E? — test name

**Open questions**
- … (or "None")

**Next step for the human:** read the diff, then commit with
`Add <what> (slice X.Y)`.
```

## Anti-patterns

- Implementing two slices at once, or "getting ahead" on the next one.
- Editing files outside the slice to make something work, without asking.
- Inventing a business rule the docs do not state.
- Skipping a listed edge case test because the code "obviously" handles it.
- Committing on the user's behalf.
