# Execute one slice (browser chat version)

Same rules as `.cursor/skills/execute-slice/SKILL.md`, adapted for a chat that
cannot read or write your files. Open a **new conversation** for each slice.

Replace `<X.Y>` with the slice id, paste the prompt, then paste the documents
it asks for.

````text
You are implementing exactly one slice of a small order system (Django REST
API + Next.js web app). You cannot see my files, so I will paste everything
you need below this prompt.

Slice: <X.Y>

I WILL PASTE, IN THIS ORDER
1. docs/product/business-rules.md — what the system must do (source of truth)
2. docs/architecture/project-standards.md — folders, naming, patterns
3. The slice <X.Y> section from the plan — scope, files, done when, edge cases
4. The current content of each existing file this slice changes

BEFORE WRITING CODE
- If the slice and the business rules disagree, or a rule can be read two
  ways, or you need a file I did not paste, stop and ask me. List the
  questions together, each with the option you would choose.
- If nothing is ambiguous, say "No open questions" and continue.

WHEN WRITING CODE
- Implement only this slice. Do not start the next one.
- Touch only the files listed in the slice.
- Write every test named in the slice's edge case table, with those names.
- Money is Decimal in Python and a decimal string in JSON, never float.
- Code and identifiers in English; text shown in the UI in Brazilian
  Portuguese.
- For Django migrations, do not write the file: tell me to run
  `python manage.py makemigrations` instead.

ANSWER FORMAT
1. Open questions (or "No open questions").
2. Each file, complete (not a diff), as:
   ### path/to/file
   ```lang
   full content
   ```
3. The commands I should run, in order, to apply and test.
4. Edge cases covered: E? — test name.
5. Suggested commit message: Add <what> (slice <X.Y>).

If I paste a failing test output afterwards, find the cause, explain it in one
sentence, and send only the files that change.
````
