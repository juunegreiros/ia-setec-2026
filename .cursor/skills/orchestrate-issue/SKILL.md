---
name: orchestrate-issue
description: >-
  Run every slice of one issue (1, 2 or 3) in order, each in its own subagent
  that follows the execute-slice skill, stopping when tests fail or questions
  come back. Use when the user says orchestrate-issue, /orchestrate-issue, or
  asks to run a whole issue with subagents.
disable-model-invocation: true
---

# Orchestrate Issue

You are the **orchestrator**. You do not write code yourself. For each slice of
the issue you start a **subagent**, give it a self-contained instruction, wait
for its report, decide whether to continue, and at the end summarize.

Key idea for the audience: the subagent does **not** see this conversation. It
only sees the instruction you write. Only its final report comes back to you.

## Input

Required: **issue number** — `1`, `2` or `3`.

## Workflow

```
- [ ] Step 1: Read the plan and list the slices of the issue
- [ ] Step 2: Show the execution plan and confirm
- [ ] Step 3: For each slice, in order: subagent → report → decide
- [ ] Step 4: Final summary
```

### Step 1 — Read the plan

1. Open `docs/plan.md`; if it does not exist, use `docs/plan.reference.md`.
2. List the slices of the requested issue, in order, with their titles.
3. Check that the issues before it are already implemented in the code. If not,
   stop and say which one is missing.

### Step 2 — Confirm

Show the user the list of slices you will run and the instruction template
below. Wait for a go-ahead before starting the first subagent.

### Step 3 — One subagent per slice, strictly in sequence

For each slice, start a subagent (in Cursor, the Task tool) with this
instruction, filling in the slice id and title. Print the exact instruction in
the chat before starting it, so the audience sees what the subagent receives.

```text
You are implementing one slice of a small order system in this repository.

Slice: <X.Y> — <title>

Follow the skill in .cursor/skills/execute-slice/SKILL.md exactly, with
slice id <X.Y>. In short: read docs/product/business-rules.md,
docs/architecture/project-standards.md and the slice in docs/plan.md
(fall back to docs/plan.reference.md). Implement only this slice, touching
only the files it lists. Write every edge case test it names. Run
`make test` and `make lint`. Do not commit.

You cannot ask the user questions directly. If something is ambiguous,
do not guess: stop before implementing that part and list the question
under "Open questions" in your report.

End with the report format defined in the execute-slice skill.
```

When the report comes back, print it in the chat, then decide:

| Report says | You do |
|-------------|--------|
| Tests pass, no open questions | Continue to the next slice |
| Any test fails | **Stop.** Show the failure and ask the user how to proceed |
| Any open question | **Stop.** Show the questions and ask the user |
| Files changed outside the slice | **Stop.** Point them out and ask the user |

Never run two slices in parallel: each slice builds on the previous one.
Never fix code yourself between subagents; if something needs fixing, it is a
stop.

### Step 4 — Final summary

```markdown
## Issue N — summary

| Slice | Result | Tests | Open questions |
|-------|--------|-------|----------------|
| N.1 | done / stopped | N passed | none / … |

**Files changed, by slice**
- N.1: `path`, `path`
- N.2: …

**Edge cases covered:** E?, E?, …

**What the human should do now**
1. Run `make test` once more from the root.
2. Read the diff slice by slice (the list above).
3. Commit. The slices ran back to back and may share files, so one commit
   for the issue is fine: `Add <what> (issue N)`.
4. Try the feature by hand (the "done when" of the last slice).
```

## Anti-patterns

- Writing code in the orchestrator instead of delegating.
- Giving the subagent an instruction that depends on this conversation
  ("as we discussed", "like before"). It cannot see it.
- Continuing after a failed test or an open question.
- Running slices in parallel.
- Committing on the user's behalf.
