---
name: execute-slice
description: >-
  Implement exactly one slice in this same conversation: take the slice ID
  (Linear sub-issue such as GAM-13, or a local slice such as 1.1), read the
  context, the description and the acceptance criteria, then execute the
  slice's Prompt section, run the tests, record the execution in the spec
  under docs/history/slices/ and report. Use when the user says
  execute-slice, /execute-slice, or asks to implement a slice.
disable-model-invocation: true
---

# Execute Slice

Implements **one** slice, and nothing else, by running the **Prompt** written
by `/create-slice`. It always runs **in this conversation**: no subagents, no
new chats. The human stays in control: when in doubt, ask; never expand the
scope.

## Input

Required: **slice ID**. If it is missing, ask for it.

| Input | Mode | Where the slice lives |
|-------|------|-----------------------|
| `GAM-13` or its Linear URL | Linear | Sub-issue in Linear + `docs/history/slices/gam-13-*.md` |
| `1.1` | local | `docs/history/slices/1.1-*.md` |

Rules: `docs/workflow/modes.md`.

## Workflow

```
- [ ] Step 1: Load the slice
- [ ] Step 2: Read the context
- [ ] Step 3: Read the description and acceptance criteria
- [ ] Step 4: Check prerequisites
- [ ] Step 5: Execute the prompt
- [ ] Step 6: Run the tests
- [ ] Step 7: Record the execution
- [ ] Step 8: Output
```

### Step 1 — Load the slice

**Linear mode:**

1. Read the sub-issue with the `linear` MCP server: description (sections
   `## Descrição`, `## Critérios de aceite`, `## Prompt`), parent plan ticket,
   project, status and comments.
2. Open the spec file `docs/history/slices/<id>-*.md` (lowercase id).
3. The prompt to execute is the one in the **ticket**. If the spec file's
   prompt differs, show the difference and ask which one to follow. If the
   ticket has no `## Prompt` section, use the spec file's.
4. If there is no spec file, offer to create it from the ticket (template
   `docs/templates/slice.md`) before executing: it is where the execution is
   recorded.
5. If the MCP does not answer, say so and ask: connect it and retry, or execute
   from the spec file.

**Local mode:** open `docs/history/slices/<id>-*.md`. Missing: **stop** and
suggest `/create-slice <plan> <step>`.

In both modes: if neither a ticket nor a spec has a Prompt, **stop** and
suggest `/create-slice`. Never implement from a title alone. If the spec
already has an execution, ask whether this is a re-run before continuing.

### Step 2 — Read the context

1. `.cursor/rules/code-quality.mdc` and `docs/architecture/project-standards.md`.
2. The product folder linked in the spec header (`docs/product/<project>/`).
3. The parent plan (linked in the spec header) and the slices of its earlier
   steps, including their "Execuções" sections.
4. Linear mode: the comments on the sub-issue and on the plan ticket.

Run `git branch --show-current` and tell the user which branch you are on. Do
not create or switch branches unless asked.

### Step 3 — Read the description and acceptance criteria

Tell the user, in two or three sentences, what this slice delivers and how it
will be checked. If the description, the acceptance criteria, the product docs
or the code contradict each other, stop and ask before executing.

### Step 4 — Check prerequisites

The step may depend on earlier steps. Confirm they are implemented: their spec
has a successful execution and the code they created exists. If not, **stop**
and say which slice must run first.

### Step 5 — Execute the prompt

Follow the Prompt block as your instructions, in this conversation:

- Read the files listed under `[LEIA ANTES]`.
- Create or change only the files under `[ARQUIVOS]`.
- Write every test under `[REGRAS E TESTES]`, with those exact names.
- Respect `[FORA DE ESCOPO]` and `[RESTRIÇÕES]`.
- Generate Django migrations with `makemigrations`; never write them by hand.
- Do not commit. Do not start another slice.

If you find a gap the prompt does not answer (a rule missing or readable two
ways, a file not listed, a name not defined), stop and ask: all questions
together, each with the option you would choose and why. Record each answer
under "Decisões tomadas na especificação" in the spec, with today's date and
"durante a execução".

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
fails after two attempts, stop, record the failed execution (Step 7) and report
the full error.

Then check each acceptance criterion and mark it as met or not.

### Step 7 — Record the execution

In the spec file, replace "Ainda não executado." (or append below the previous
entries) with:

```markdown
### <AAAA-MM-DD> — <sucesso | falhou | parcial>

- **Branch:** <branch>
- **Arquivos alterados:** `path` — por quê; …
- **Testes:** `make test` — N passaram / M falharam; `make lint` — limpo | erros
- **Critérios de aceite:** todos atendidos | <quais não>
- **Casos cobertos:** E? — `test_name`; …
- **Desvios do prompt:** <o que mudou e por quê, ou "nenhum">
- **Dúvidas em aberto:** <lista ou "nenhuma">
```

On success, set the spec status to `executado`, mark the acceptance criteria
checkboxes, update the slice's row in `docs/history/slices/README.md`, and in
the plan file add `— executado em <AAAA-MM-DD>` to the step's `Slice:` line.

Linear mode: offer to post a comment on the sub-issue with this summary. Post
it only after approval. Never change the ticket status.

## Output

Always end with:

```markdown
## Slice <ID> — <title> — <success | failed | partial>

**Mode:** Linear | local
**Spec:** docs/history/slices/<file>.md
**Branch:** <branch>

**Files changed**
- `path` — why

**Tests run**
- `make test` — N passed / M failed
- `make lint` — clean | errors

**Acceptance criteria**
- [x] … / [ ] … — why not

**Rules and edge cases covered**
- R? / E? — test name

**Deviations from the prompt:** <list or "none">
**Open questions:** <list or "none">

**Next step for the human:** read the diff, stage the files
(`git add <paths>`) and run `/commit` (suggested message:
`<ID> <type>(<scope>): <summary>`). Linear mode: move <ID> to the next status
if you want; I did not change it. Next slice: `/execute-slice <next ID>`.
```

## Anti-patterns

- Implementing without a Prompt, or from the ticket title.
- Delegating to a subagent or a new chat: this skill runs here.
- Implementing two slices at once, or "getting ahead" on the next one.
- Editing files outside `[ARQUIVOS]` to make something work, without asking.
- Inventing a business rule the docs do not state.
- Skipping a named test because the code "obviously" handles it.
- Changing the Linear status or committing on the user's behalf.
