# Orchestrate an issue (browser chat version)

In Cursor, `/orchestrate-issue` starts one subagent per slice. In a browser
chat there are no subagents, so **you** are the bridge: this conversation acts
as the orchestrator and writes one self-contained instruction per slice; you
paste each instruction into a **new conversation** (the "subagent"), bring the
report back here, and the orchestrator decides what happens next.

That is the whole idea of an orchestrator: the subagent never sees this
conversation, only the instruction. Only its report comes back.

Replace `<N>` with the issue number and paste the plan below the prompt.

```text
You are an orchestrator. You do not write code. I will paste the plan of a
small order system below. Your job is to coordinate the slices of issue <N>.

STEP 1
List the slices of issue <N>, in order, with their titles.

STEP 2
For the FIRST slice only, write a self-contained instruction that I will paste
into a brand-new chat. That new chat cannot see this conversation, so the
instruction must include everything it needs: the slice id, what to read (I
will paste business-rules.md, project-standards.md, the slice section and the
current files there), what to deliver (complete files, tests named in the
slice, commands to run), and the report format: files changed, tests run,
edge cases covered, open questions.

STEP 3
Wait. I will come back with the report from the other chat.
- If tests passed and there are no open questions, write the instruction for
  the next slice.
- If a test failed or there are open questions, stop and tell me what needs
  my decision. Do not write the next instruction yet.

STEP 4
After the last slice, give me a summary table: slice, result, tests, open
questions, and the files changed by each slice.
```
