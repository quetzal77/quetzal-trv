---
name: add-visit
description: >
  Record a trip in quetzal-trv. Given places and dates (e.g. "add a visit to Sofia and
  Plovdiv, 16-18 May 2026"), create any missing `city` entries in DATA/globaldb.json
  (English/native/Ukrainian names, the region link, coordinates, a Ukrainian description
  with key landmarks) and append the `visit` entry. Use whenever the user says they visited /
  travelled somewhere and wants it added to the site.
---

# add-visit

Adds a trip and any new cities it introduces. The data file is **CRLF** and hand-maintained —
keep it valid and consistent.

## 1. Parse the request
- Extract the **list of places** and the **start/end dates**. Format dates as `DD.MM.YYYY`
  (zero-padded, e.g. `16.05.2026`). A single-day trip uses the same start and end date.

## 2. For each place, ensure a `city` entry exists

### 2a. Search before creating — three-pass lookup

**Never skip this step.** Run all three checks before deciding the city is absent:

1. **By city_id slug** (exact):
   ```
   grep -n '"city_id": "<slug>"' DATA/globaldb.json
   ```
2. **By English name** (case-insensitive substring):
   ```python
   python -c "
   import json, sys
   sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
   q = '<English name>'.lower()
   db = json.load(open('DATA/globaldb.json', encoding='utf-8'))
   for c in db['city']:
       if q in (c.get('name') or '').lower() or q in (c.get('name_nt') or '').lower():
           print(c['city_id'], '|', c.get('name'), '|', c.get('name_ua'), '|', c.get('region_id'))
   "
   ```
3. **By Ukrainian name** (case-insensitive substring):
   ```python
   python -c "
   import json, sys
   sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
   q = '<Ukrainian name>'.lower()
   db = json.load(open('DATA/globaldb.json', encoding='utf-8'))
   for c in db['city']:
       if q in (c.get('name_ua') or '').lower():
           print(c['city_id'], '|', c.get('name'), '|', c.get('name_ua'), '|', c.get('region_id'))
   "
   ```

**Decision rules after the search:**
- **Zero matches across all three passes** → proceed to create the city.
- **Exactly one match that clearly corresponds** (same country, same place) → reuse it, skip creation.
- **One or more ambiguous matches** (common name like "Василівка", "Парк", "Memorial", or
  a name shared by multiple cities/countries) → **stop and ask the user**. Show a table of
  all candidates:

  > Знайдено схожі назви в базі — яке з них ваше місто, або потрібно додати нове?
  >
  > | city_id | EN name | UA name | region |
  > |---|---|---|---|
  > | vasyliv1 | Vasylivka | Василівка | UA-23 |
  > | vasyliv2 | Vasylivka | Василівка | UA-65 |
  > | (нове) | — | — | — |

  Do not create or reuse anything until the user confirms.

- Derive a **city_id**: lowercase ASCII slug of the English name (e.g. `Sofia`→`sofia`,
  `Veliko Tarnovo`→`velikotarnovo`).

### 2b. Create the city entry (only if confirmed absent)

  - **name** = English, **name_nt** = native-language name, **name_ua** = Ukrainian.
  - **region_id** = the ISO-3166-2 region the city sits in (e.g. `BG-23`). It MUST already
    exist in `area[]` for that country: `grep -n '"region_id": "BG-' DATA/globaldb.json`.
    If the country/regions aren't in the data yet, run the **add-country** skill first.
  - **lat** / **long** = decimal coordinates (geocode the place; confirm with the user if unsure).
  - **description** = 2–4 sentences in **Ukrainian**. Must include the **main landmarks and
    sights** of the city so it's clear what was there to see. This is the primary reference for
    what the user actually visited — do not write generic text; name specific attractions.
  - **image**: do NOT add the `image` field unless the user explicitly asks for it.
  - Optional: `"capital": "true"`, `"type"` (location-type id), `lat_2`/`long_2`.

- **Where to insert the new city object**: find the country's **capital city** in `city[]`
  (the entry with `"capital": "true"` for that country) and insert the new city **immediately
  after** it. This keeps all cities of the same country grouped together.
  - To find the capital: `grep -n '"capital": "true"' DATA/globaldb.json` then look at the
    surrounding entries to identify the one for the right country (check `region_id` prefix).
  - If the country has no capital marked, insert after the last existing city of that country.

  Example city object:
  ```json
  {
    "name": "Crikvenica",
    "name_nt": "Crikvenica",
    "name_ua": "Цриквениця",
    "region_id": "HR-08",
    "city_id": "crikvenica",
    "lat": "45.1767",
    "long": "14.6922",
    "description": "Курортне місто на узбережжі Адріатичного моря. Головні пам'ятки: замок Трсат, набережна Штранд, церква Благовіщення Пресвятої Богородиці та руїни давньоримського муніципію Адальбертінум."
  }
  ```

## 3. Append the visit
Add to `visit[]` (newest trips are kept at the top — insert right after the `  "visit": [` line):
```json
{
  "start_date": "16.05.2026",
  "end_date": "18.05.2026",
  "city": ["sofia", "plovdiv"]
}
```
Optional fields: `"photos": "<album url>"`, `"story": true` (if you'll write a story XML) or
`"story": "<url>"`.

## 4. Normalize line endings + validate
Edit may introduce LF lines into this CRLF file — normalize and validate JSON:
```
python -c "import json;p='DATA/globaldb.json';t=open(p,encoding='utf-8').read();json.loads(t);open(p,'wb').write(('\r\n'.join(t.splitlines())+'\r\n').encode('utf-8'));print('normalized + valid')"
```

## 5. Verify
Run the **check-data** skill (`python .claude/skills/check-data/check_data.py`) — confirm
`RESULT: OK` and that the new cities/visit resolve cleanly.
If `image` was added: remind the user to drop the photo into `IMG/`.

## Rules
- Touch only `city[]` and `visit[]`. Never invent a `region_id` that isn't in `area[]`.
- Reuse existing cities (don't duplicate a `city_id`).
- Keep names in all three languages; descriptions in Ukrainian.
- **Never add `image` field** unless the user explicitly requests it.
- **Always include landmarks** in the description — generic text is not acceptable.
- **Insert new cities after the country's capital**, not at the top of `city[]`.