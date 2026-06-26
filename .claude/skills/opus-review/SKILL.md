# opus-review

Deep code review of the quetzal-trv codebase. Run this with Opus model for maximum effectiveness.
Produces a prioritised, actionable findings report — no vague suggestions, only concrete file:line issues.

## What to review

### 1. i18n completeness
- Read `SCRIPTS/i18n.js` fully — note every key in both `uk` and `en` sections
- Grep all `*.js` files for `t('...')` calls and collect every key used
- Report: keys used in JS but **missing** from i18n.js (either uk or en section)
- Report: keys present in i18n.js but **never used** anywhere (dead keys)
- Report: keys where uk and en values are **identical** (likely a copy-paste miss)

### 2. Hardcoded Ukrainian strings
Search all files in `SCRIPTS/` for Ukrainian Cyrillic text that is NOT inside `i18n.js`:
- Any string literal containing Cyrillic in `*.js` files outside `i18n.js`
- Exceptions: `globaldb.json` data references, DB field names, console.log, comments
- Report: file, line number, the string

### 3. entityName() consistency
- `window.entityName(entity)` returns `name` (EN) or `name_ua` (UK)
- Find all places in `SCRIPTS/` where `entity.name_ua` or `entity.name` is accessed directly
  instead of going through `entityName()` — these are potential bilingual bugs
- Exceptions: i18n.js itself, places that explicitly need one specific field

### 4. LANG-aware code audit
- Find all `window.LANG` or `LANG ===` checks — list them
- For each: does the EN branch produce correct English output, or does it fall back to Ukrainian?
- Specifically check: `getMonthName()`, `parseWord()`, `setVisitsNumberWithCorrectEnd()`,
  `getVisitDate()` — are these used in EN contexts where they'd output Ukrainian?

### 5. CSS orphans
- Read `THEMES/global.css`
- List CSS classes/IDs defined in global.css but never referenced in any `SCRIPTS/*.js` or `index.html`
- List class names used in JS string templates (e.g. `'<div class="foo">'`) but not defined in global.css

### 6. Encoding check
Run this Python snippet for every file in SCRIPTS/ and THEMES/:
```python
import os
for root, dirs, files in os.walk('SCRIPTS'):
    for f in files:
        if f.endswith('.js'):
            path = os.path.join(root, f)
            try:
                open(path, 'rb').read().decode('utf-8')
            except UnicodeDecodeError as e:
                print('FAIL', path, e)
for f in os.listdir('THEMES'):
    if f.endswith('.css'):
        try:
            open('THEMES/' + f, 'rb').read().decode('utf-8')
        except UnicodeDecodeError as e:
            print('FAIL', 'THEMES/' + f, e)
print('done')
```
Report any failures immediately — this is a critical issue (see memory: feedback_sed_encoding).

### 7. Functional logic review
Review these specific functions for correctness:
- `getSelectorOfListOfStories_HTML()` in `bcd_services.js` — does the EN story appear correctly?
- `generateStoriesIndex()` in `set_overview.js` — does language field get preserved?
- `dayWord()` in `set_overview.js` — correct EN pluralisation?
- `statsFmtDate()` in `trv_statistics.js` — correct EN date format?
- `storyDate()` in `trv_story.js` — does `storyDateSuffix` work for both langs?

## Output format

Produce a report with these sections:

```
## 🔴 Critical (breaks functionality)
- file.js:LINE — description

## 🟡 Warnings (wrong language or inconsistency)
- file.js:LINE — description

## 🟢 Dead code / cleanup
- file.js:LINE — description

## ✅ Confirmed working
- list of things explicitly verified as correct
```

Be specific: always include file name and line number.
Do NOT suggest refactors beyond what's needed for correctness.
Do NOT rewrite code — only report findings. The developer will decide what to fix.