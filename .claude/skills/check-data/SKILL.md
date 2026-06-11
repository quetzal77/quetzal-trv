---
name: check-data
description: >
  Validate the quetzal-trv data files (DATA/globaldb.json and DATA/onload.json).
  Read-only integrity check: JSON validity, CRLF line endings, referential integrity
  across visit→city→area(region)→country→continent, duplicate IDs, missing names/
  descriptions, and missing image/flag/map asset files. Use after editing the data,
  before committing, or to hunt down corruption / "why doesn't this city show up".
---

# check-data

Runs a read-only validator over the project's data files and reports problems.

## How to run

From the project root:

```
python .claude/skills/check-data/check_data.py
```

It prints entity counts, the CRLF status, then an **ERRORS** list and a **WARNINGS**
list, ending in `RESULT: OK` or `RESULT: FAIL` (exit code 1 on errors).

## What it checks

- **JSON valid** and **CRLF** line endings preserved (the file is CRLF; mixed endings are flagged).
- **Referential integrity:** every `visit.city` exists in `city[]`; every `city.region_id`
  exists in `area[]`; every `area.country_id` exists in `country[]`; every
  `country.continent_id` / `continent_id2` and `area.continent_id` exist in `continent[]`.
- **Duplicate IDs** within `continent`/`country`/`area`/`city`.
- **Completeness (warnings):** city/area missing `name_ua`; city with empty `description`;
  `visit` dates not in `DD.MM.YYYY`.
- **Assets (warnings):** `city.image` files exist under `IMG/`; country `flag_img`/`emb_img`
  under `IMG/flag_n_emblem/`; `country.map_img` under `SCRIPTS/MAPS/`.

## How to act on results

- **ERRORS** are real data bugs — fix them (e.g. a duplicate `region_id`, or a city
  pointing at a non-existent region). Offer to fix, then re-run until `RESULT: OK`.
- **WARNINGS** are advisory (missing description, single-digit date, missing image file) —
  surface them but don't block.
- This skill never modifies any file. If you fix issues, make the edits CRLF-safe and
  re-run the validator to confirm.
