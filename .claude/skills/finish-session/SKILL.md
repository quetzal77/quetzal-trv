---
name: finish-session
description: >
  End-of-session wrap-up for quetzal-trv: bump the product version in index.html,
  commit all staged/unstaged changes with a summary message, then push to the remote.
  Use when the user says they're done for the session, or asks to "finish", "wrap up",
  "commit and push", "закоміть і запуш" etc.
---

# finish-session

Wraps up the current work session: version bump → commit → push.

## 0. Get approval FIRST — mandatory step

Before doing anything else, run `git status` and `git diff --stat` to understand what changed, then **show the user a summary** and ask for explicit approval:

> Готово до фіналізації:
> - нова версія: **X.Y.Z**
> - змінені файли: …
> - повідомлення коміту: «…»
>
> Підтверджуєш?

**Do not proceed to steps 1–6 until the user replies with confirmation** (e.g. "так", "yes", "ок", "давай", thumbs up).  
If the user says no or asks for changes — adjust and ask again.

## 1. Check what changed

```
git status
git diff --stat
```

Look at the diff to understand what was actually modified — you'll need this for the commit message.

## 2. Read the current version

```
grep "?v=" index.html
```

The version string appears in `index.html` (multiple assets), `SCRIPTS/bcd_onload.js` (`APP_V`), `CLAUDE.md`, and `SCRIPTS/bcd_services.js` (tech-tag).

## 3. Bump the patch version

Increment the **last** number: `9.1.27` → `9.1.28`.  
If the user explicitly requests a minor bump, increment the middle number and reset patch to 0: `9.1.27` → `9.2.0`.

Use Python (safe for UTF-8 — never use sed on these files):
```python
OLD, NEW = '9.2.4', '9.2.5'   # adjust to actual old/new versions

# 1. index.html — all ?v= occurrences
p = 'index.html'
c = open(p, encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(c.replace('?v=' + OLD, '?v=' + NEW))

# 2. APP_V in bcd_onload.js
p = 'SCRIPTS/bcd_onload.js'
c = open(p, encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(c.replace("APP_V = '" + OLD + "'", "APP_V = '" + NEW + "'"))

# 3. CLAUDE.md
p = 'CLAUDE.md'
c = open(p, encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(c.replace('**' + OLD + '**', '**' + NEW + '**'))

# 4. bcd_services.js tech-tag
import re
p = 'SCRIPTS/bcd_services.js'
c = open(p, encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(re.sub(r"tech-tag'>v[\d.]+<", "tech-tag'>v" + NEW + "<", c))
```

Confirm after:
```
grep "?v=" index.html
grep "APP_V" SCRIPTS/bcd_onload.js
grep "Current version" CLAUDE.md
grep "tech-tag.*v[0-9]" SCRIPTS/bcd_services.js
```
All occurrences must show the new version.

## 4. Stage everything

```
git add -A
```

## 5. Write the commit message

- First line: short summary of what changed (max 72 chars), e.g.  
  `Add PDF + CSV export, remove MD button (v9.1.28)`
- If there are multiple distinct changes, add a blank line then a short bullet list.
- End with the co-author trailer.

```
git commit -m "$(cat <<'EOF'
<your summary here> (vX.Y.Z)

- bullet 1
- bullet 2

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

## 6. Push

```
git push
```

Confirm the push succeeded and report the new version and commit hash to the user.

## Rules

- Never force-push (`--force`).
- Never skip hooks (`--no-verify`).
- If `git push` fails (e.g. remote has new commits), run `git pull --rebase` first, then push again.
- If there is nothing to commit (`git status` is clean), skip steps 3–5 and just push if there are unpushed commits; otherwise tell the user there is nothing to do.
- Do not bump the version if only non-JS/CSS files changed (e.g. only `DATA/*.json` or `.claude/` files) — the `?v=` cache-bust is only needed when browser-cached assets change.