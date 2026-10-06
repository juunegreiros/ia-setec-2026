---
name: commit
description: >-
  Commit only what is already staged, with a Conventional Commits message
  that starts with the ticket ID (GAM-123 with Linear, 1.1 in local mode).
  Never stages, unstages or discards anything: it warns about loose files
  and asks before committing. Use when the user says commit, /commit, or asks
  to commit the staged changes.
disable-model-invocation: true
---

# Commit

Turns the **staged** changes into one commit. The person decides what goes in
by staging it; this skill only reads, writes the message, confirms and
commits.

## Input

Optional: **ticket ID** (`GAM-123` with Linear, `1.1` in local mode; rules in
`docs/workflow/modes.md`) and any context about the change.

## Message format

```text
<ticket> <type>(<scope>): <summary>

<body: what changed and why, wrapped at 72 columns>
```

- **ticket**: `GAM-123` or `1.1`. Without a ticket (only if the user says so),
  the header starts at `<type>`.
- **type**: `feat` (new behavior), `fix` (bug fix), `docs`, `test`,
  `refactor` (no behavior change), `style`, `perf`, `build`, `ci`, `chore`.
- **scope** (optional): the area, e.g. `api`, `web`, `docs`, `skills`.
- **summary**: English, imperative, lowercase, no final period. The whole
  header fits in 72 characters.
- **body**: optional for small changes. Explain the why, not the diff.
- **Breaking change**: `!` after the scope and a `BREAKING CHANGE:` footer.

Examples:

```text
GAM-13 feat(api): add product model and admin
1.2 test(api): cover inactive products in product list
GAM-20 docs(skills): add commit skill
```

## Workflow

```
- [ ] Step 1: Check what is staged
- [ ] Step 2: Warn about loose files
- [ ] Step 3: Read the staged diff
- [ ] Step 4: Find the ticket
- [ ] Step 5: Draft the message and confirm
- [ ] Step 6: Commit
- [ ] Step 7: Output
```

### Step 1 — Check what is staged

Run `git status --porcelain` and `git diff --cached --stat`. If nothing is
staged, **stop**: tell the user to stage the files (`git add <path>`) and run
`/commit` again.

### Step 2 — Warn about loose files

From `git status --porcelain`, list separately:

- **Modified, not staged** (second column `M` or `D`), including files that
  are partly staged (`MM`): only the staged part will be committed.
- **Untracked** (`??`).

If there are any, show the list and ask: commit only what is staged, or stop
so the user stages more? If they want to stage, give them the exact
`git add` command to run themselves and wait.

Also warn, before going on, if the staged files include something that
should not be committed: `.env`, keys or tokens, `node_modules/`, `.venv/`,
`db.sqlite3`, build output, or very large files.

### Step 3 — Read the staged diff

Read `git diff --cached`. If the diff is long, read it file by file. Work
out the type and scope from what actually changed, not from file names.

If the staged changes mix unrelated work (e.g. a feature and an unrelated
fix), suggest splitting it and say which paths to unstage
(`git restore --staged <path>`), for the user to run. Continue only with
their answer.

### Step 4 — Find the ticket

In this order:

1. The ticket the user gave.
2. The current branch name (`git branch --show-current`), e.g.
   `feat/gam-123-…` → `GAM-123`.
3. Staged files under `docs/history/slices/` or `docs/history/plans/`, e.g.
   `gam-13-…` → `GAM-13`, `1.1-…` → `1.1`.
4. The slice just executed in this conversation.

If none is found or they disagree, ask. Offer "no ticket" as an option; never
invent an ID.

### Step 5 — Draft the message and confirm

Show the full message, the ticket's source, and the staged files, then wait
for **explicit confirmation**. Apply the user's edits and show it again if
it changed.

### Step 6 — Commit

```bash
git commit -m "<header>" -m "<body>"
```

Then run `git log -1 --stat` and `git status --porcelain`. If a hook fails,
show the full error and stop.

## Output

Always end with:

```markdown
## Commit <short hash> — <header>

**Ticket:** <ID and where it came from, or "none">
**Files:** N committed — `path`, …
**Left out (not staged):** <list or "nothing">

**Next step:** <`/execute-slice <next ID>`, push when you decide, …>
```

## Anti-patterns

- Running `git add`, `git rm`, `git restore`, `git stash`, `git reset` or
  `git checkout` on files: what goes in is the user's decision.
- `--amend`, `--no-verify`, `-a` or pushing, unless the user explicitly asks.
- Committing without showing the message and getting confirmation.
- Inventing a ticket ID, or a message that describes the files instead of
  the change.
- A Portuguese commit message: commits are in English.
