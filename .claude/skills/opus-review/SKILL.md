# opus-review

Deep code review of the quetzal-trv codebase. Run with Opus model for maximum effectiveness.
Produces a prioritised, actionable findings report saved to a file — no vague suggestions, only concrete file:line issues.

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

### 8. generateGlobalDb() correctness (set_overview.js:1017)
Read `generateGlobalDb()` in full and check:

**Serialization:**
- `JSON.stringify(data, null, 2)` serializes the live `data` object. Visits have `.start_date` and `.end_date` as JavaScript `Date` objects (set in `bcd_onload.js`). Verify whether `JSON.stringify` will produce correct ISO strings or will serialize them differently than the original file. Compare with the raw string values in `DATA/globaldb.json` — do the round-tripped date strings match the original format?
- `stableStringify` sorts object keys alphabetically for diff comparison. Check whether this causes the diff to report false `changed` entries when key order in memory differs from the file but values are identical.

**CRLF normalization:**
- The generated file uses `json.replace(/\r\n|\r|\n/g, '\r\n')`. Verify this correctly handles all three line-ending variants and that the final `\r\n` trailing newline matches what `DATA/globaldb.json` currently ends with.

**Diff reporting:**
- The `ARRAYS` config covers all 7 data arrays: `continent`, `country`, `area`, `city`, `visit`, `type`, `country_type`. Confirm none are missing.
- For `visit`, the key is `start_date + ' — ' + end_date`. If `start_date` is a `Date` object in memory, `.toString()` is called implicitly — verify the key matches what the file-loaded `existing` object would produce (where dates are plain strings).
- The `added` detection uses `!oldMap[k]` — this is falsy for both `undefined` and `null` but also for `0` and `""`. Is a visit key ever an empty string? Check edge cases.

**EN pluralisation:**
- `pStr` in EN uses `n + ' ' + cfg.formsEn + (n === 1 ? '' : 's')` — verify this works for all `formsEn` values: `'continent'`, `'country'`, `'region'`, `'city'`, `'visit'`, `'type'`, `'country type'`.

### 9. generateOnloadJson() correctness (set_overview.js:314)
Read `generateOnloadJson()` in full and check:

**Reference chain:**
- For each visit, it iterates `v.city[]` → looks up `cityRegion[cityId]` → `regionCountry[regionId]` → country object. Check what happens when a `city_id` in a visit has no matching entry in `data.city` (orphan reference). Does it silently skip, or does it corrupt the output?
- Same for `region_id` → `country_id` chain — what if an `area` entry has a `country_id` not in `data.country`?

**Output completeness:**
- List every field that `onload.json` is supposed to contain (read the existing `DATA/onload.json` to learn its schema). Verify `generateOnloadJson()` writes all of them — nothing silently omitted.
- `DATA/onload.json` is described as a "denormalised subset for fast home-page render" — check whether the generated object matches what `bcd_onload.js` actually reads from `onload.json` on startup.

**Diff reporting:**
- The function compares new vs existing visited-country lists. Check whether the added/removed detection uses the same key as the output array (`country_id`? `short_name`?), so the diff is accurate.

### 10. generateStoriesIndex() correctness (set_overview.js:258)
Read `generateStoriesIndex()` in full and check:

**Language field:**
- Each entry in `stories.json` has `{id, language, title, date}`. Does the generated index include the `language` field from each story file? Verify the field is read from `story.language` and written to the index entry — it was recently added and could be missing.
- If a story file is missing the `language` field entirely, what does the generated index entry contain — `undefined`, `null`, or is the field omitted?

**Date handling:**
- Where does `date` come from in the generated entry? Is it `story.date`? What is the expected format — verify it matches the existing `DATA/stories.json` entries.

**Failure handling:**
- Fetches are done with `.always()` to skip missing files. If a story file returns invalid JSON (parse error), does the `.done()` callback fire or `.fail()`? Would a corrupt story file silently be skipped or cause the whole generation to hang?

### 11. ES5 compliance scan
Run a targeted grep for ES6+ syntax that must not appear in production scripts:
```
grep -n "=>" SCRIPTS/*.js
grep -n "\blet\b\|\bconst\b" SCRIPTS/*.js
grep -n "`" SCRIPTS/*.js
grep -n "\bclass\b" SCRIPTS/*.js
grep -n "\.\.\." SCRIPTS/*.js
```
Report any hits with file and line number. Exceptions: content inside string literals or comments is acceptable — judge by context.

### 12. Dynamic script loading audit
The app loads page scripts on demand via `$.getScript`. Check every call:
- Grep `SCRIPTS/` for `$.getScript` — list every file path referenced
- For each path, verify the file actually exists on disk
- Check `bcd_onload.js` for the initial load sequence — are all scripts in the correct dependency order?
- Check whether any `$.getScript` call has no `.fail()` or error callback — a 404 would silently leave the page blank

### 13. globaldb.json structural integrity
Run these Python checks directly against `DATA/globaldb.json`:
```python
import json
db = json.load(open('DATA/globaldb.json', encoding='utf-8'))

city_ids   = {c['city_id']          for c in db['city']}
region_ids = {r['region_id']        for r in db['area']}
country_ids= {c['country_id']       for c in db['country']}
cont_ids   = {c['continent_id']     for c in db['continent']}
ctype_ids  = {t['country_type_id']  for t in db['country_type']}
type_ids   = {t['type_id']          for t in db['type']}

orphan_city_region   = [c['city_id']   for c in db['city']     if c.get('region_id')      and c['region_id']      not in region_ids]
orphan_area_country  = [r['region_id'] for r in db['area']     if r.get('country_id')     and r['country_id']     not in country_ids]
orphan_country_cont  = [c['country_id']for c in db['country']  if c.get('continent_id')   and c['continent_id']   not in cont_ids]
orphan_country_type  = [c['country_id']for c in db['country']  if c.get('country_type_id')and c['country_type_id']not in ctype_ids]
orphan_city_type     = [c['city_id']   for c in db['city']     if c.get('type')            and c['type']           not in type_ids]
orphan_visit_city    = [(i, cid) for i,v in enumerate(db['visit']) for cid in (v.get('city') or []) if cid not in city_ids]

for label, lst in [
    ('city->region orphans',    orphan_city_region),
    ('area->country orphans',   orphan_area_country),
    ('country->cont orphans',   orphan_country_cont),
    ('country->type orphans',   orphan_country_type),
    ('city->type orphans',      orphan_city_type),
    ('visit->city orphans',     orphan_visit_city),
]:
    print(label + ':', lst or 'none')

for arr, field in [('city','city_id'),('area','region_id'),('country','country_id'),('continent','continent_id'),('type','type_id'),('country_type','country_type_id')]:
    ids = [x[field] for x in db[arr]]
    dups = [x for x in set(ids) if ids.count(x) > 1]
    if dups: print('DUPLICATE', field + ':', dups)

for c in db['city']:
    if not c.get('name_ua'): print('city missing name_ua:', c.get('city_id'))
    if not c.get('name'):    print('city missing name:',    c.get('city_id'))
for c in db['country']:
    if not c.get('short_name'): print('country missing short_name:', c.get('country_id'))
```
Report every non-empty result as a critical finding.

### 14. Dead functions and unreachable code
- Grep all `SCRIPTS/*.js` for `^function ` and `var .* = function` to collect every defined function name
- For each function, grep all JS files for calls to it (by name followed by `(`)
- Report functions that are never called from anywhere — they are dead code or indicate a disconnected feature
- Exceptions: functions called from HTML `onclick=` attributes, `$.getScript` callbacks, and `window.*` assignments (these are public API)

### 15. Dead JS files
- List all `*.js` files in `SCRIPTS/` (excluding `SCRIPTS/MAPS/`)
- Collect all scripts referenced in `index.html` `<script src=` tags
- Collect all paths referenced in `$.getScript(...)` calls across all JS files
- Report any file that appears in neither list — it is on disk but never loaded

### 16. Unused images
Run this Python check:
```python
import os, json, re

# Collect all image filenames referenced anywhere in the codebase
refs = set()
for root, dirs, files in os.walk('SCRIPTS'):
    for f in files:
        if f.endswith('.js'):
            txt = open(os.path.join(root, f), encoding='utf-8', errors='ignore').read()
            refs.update(re.findall(r'[\w\-]+\.(?:jpg|jpeg|png|gif|svg|webp)', txt, re.I))
for f in ['index.html']:
    txt = open(f, encoding='utf-8', errors='ignore').read()
    refs.update(re.findall(r'[\w\-]+\.(?:jpg|jpeg|png|gif|svg|webp)', txt, re.I))
txt = open('DATA/globaldb.json', encoding='utf-8', errors='ignore').read()
refs.update(re.findall(r'[\w\-]+\.(?:jpg|jpeg|png|gif|svg|webp)', txt, re.I))

# Walk IMG/ and find files not referenced
unused = []
for root, dirs, files in os.walk('IMG'):
    for f in files:
        if f.lower() not in {r.lower() for r in refs}:
            unused.append(os.path.join(root, f))

print('Unused images:', len(unused))
for p in sorted(unused): print(' ', p)
```
Report the count and list. This is cleanup, not a bug — but matters for the free hosting disk quota.

### 17. jQuery event handler leak audit
In this SPA, all pages render into `#mainSection` on navigation without a page reload.
If a handler is attached with `.on()` every time a page renders (without a prior `.off()`), it accumulates.
- Grep `SCRIPTS/*.js` for `.on(`, `.bind(`, `.live(`, `.click(`, `.change(`, `.submit(` calls
- For each match: is it inside a function that runs on every page render (e.g. `createSettings*_HTML`, `render*`, `show*`)?
- If yes: is there a corresponding `.off()` before it, or is the target element freshly created innerHTML (in which case no leak occurs)?
- Report handlers that are attached to persistent DOM nodes (e.g. `$(document)`, `$(window)`, `$('body')`) inside page-render functions without cleanup

### 18. Missing `var` — accidental global variables
In ES5, a missing `var` makes a variable implicitly global, which can cause state to leak between page navigations.
Run:
```
grep -n "^\s\+[a-zA-Z_$][a-zA-Z0-9_$]* = " SCRIPTS/*.js
```
For each hit: check whether the variable was declared with `var` earlier in the same function scope.
Report assignments that are missing a `var` declaration — these are accidental globals.
Exceptions: assignments to `window.*`, `local[*]`, known globals like `data`, `visitsSorted`.

### 19. `URL.createObjectURL` without `revokeObjectURL`
Each file download (globaldb, onload, stories, CSV, PDF) creates a Blob URL. If `revokeObjectURL` is never called, the browser holds the blob in memory until the tab is closed. In a long-lived SPA this is a real memory leak.
- Grep `SCRIPTS/*.js` for `createObjectURL`
- For each occurrence: check whether `revokeObjectURL` is called on the same URL after the download link is clicked
- Report any `createObjectURL` call with no matching `revokeObjectURL`

### 20. Ajax calls without error handlers
- Grep `SCRIPTS/*.js` for `$.ajax(`, `$.getJSON(`, `$.getScript(`
- For each call: check whether `.fail(`, `.error(`, or `error:` callback is present
- Report calls with no error handling — a server 404/500 would silently leave the UI in a broken or loading state
- Flag as critical if the missing handler is on a call that populates core UI (e.g. loading `globaldb.json`, `onload.json`, story files)

### 21. `console.log` in production code
- Grep `SCRIPTS/*.js` for `console.log`, `console.warn`, `console.error`, `console.dir`
- Report file and line — these should be removed before prod deploy
- Exception: if a comment explicitly marks it as intentional debug output, note it but still report

### 22. Cache-busting audit
All browser-cached assets must have a `?v=X.Y.Z` query parameter so deploys take effect immediately.
- Read `index.html` — list every `<script src=` and `<link href=` that loads a local file
- Report any local asset loaded **without** a `?v=` parameter
- Additionally: `$.getScript(path)` calls load scripts dynamically. These are NOT cache-busted unless the path includes `?v=`. Check every `$.getScript` path — does it include a version parameter or `cache: false`?
- Report all gaps — a missing `?v=` on any asset means old code may survive a deploy

### 23. Data integrity: visits, cities, stories cross-check
Run this Python check:
```python
import json, os

db    = json.load(open('DATA/globaldb.json', encoding='utf-8'))
idx   = json.load(open('DATA/stories.json',  encoding='utf-8'))
story_ids = {s['id'] for s in idx}

# Visits without any cities
no_cities = [i for i,v in enumerate(db['visit']) if not v.get('city')]
print('Visits without cities:', no_cities or 'none')

# Visits referencing a story_int that is not in stories.json
bad_story = [(i, v['story_int']) for i,v in enumerate(db['visit'])
             if v.get('story_int') and v['story_int'] not in story_ids]
print('Visits with unknown story_int:', bad_story or 'none')

# Cities without coordinates
no_coords = [c['city_id'] for c in db['city']
             if not c.get('lat') and not c.get('long')]
print('Cities without coordinates:', len(no_coords), no_coords[:10])

# Countries without short_name (used as URL slug)
no_slug = [c['country_id'] for c in db['country'] if not c.get('short_name')]
print('Countries without short_name:', no_slug or 'none')
```
Report every non-empty result. Missing `story_int` references are 🔴 Critical (broken link on visit page).

## Output format

**Write the full report to `.claude/review-YYYY-MM-DD.md`** in the project root (use today's date).
Do not just print findings to the console — the file is the deliverable.

Structure the file as follows:

```markdown
# Code Review — YYYY-MM-DD

## 🔴 Critical (breaks functionality)
- `file.js:LINE` — description

## 🟡 Warnings (wrong language, inconsistency, or silent failure)
- `file.js:LINE` — description

## 🟢 Dead code / cleanup
- `file.js:LINE` — description

## ✅ Confirmed working
- list of blocks explicitly verified as correct with no findings
```

Rules:
- Always include file name and line number for every finding
- Do NOT suggest refactors beyond what is needed for correctness
- Do NOT rewrite code — only report findings; the developer decides what to fix
- If a check produces no findings, list it under ✅ Confirmed working
- At the top of the file, note the version reviewed (read from `grep "?v=" index.html`)