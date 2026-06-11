---
name: add-visit
description: >
  Record a trip in quetzal-trv. Given places and dates (e.g. "add a visit to Sofia and
  Plovdiv, 16-18 May 2026"), create any missing `city` entries in DATA/globaldb.json
  (English/native/Ukrainian names, the region link, coordinates, image name, a Ukrainian
  description) and append the `visit` entry. Use whenever the user says they visited /
  travelled somewhere and wants it added to the site.
---

# add-visit

Adds a trip and any new cities it introduces. The data file is **CRLF** and hand-maintained —
keep it valid and consistent.

## 1. Parse the request
- Extract the **list of places** and the **start/end dates**. Format dates as `DD.MM.YYYY`
  (zero-padded, e.g. `16.05.2026`). A single-day trip uses the same start and end date.

## 2. For each place, ensure a `city` entry exists
- Derive a **city_id**: lowercase ASCII slug of the English name (e.g. `Sofia`→`sofia`,
  `Veliko Tarnovo`→`velikotarnovo`). Check if it already exists:
  `grep -n '"city_id": "<id>"' DATA/globaldb.json`. If it exists, reuse it — skip creation.
- If missing, gather/derive these fields and create the entry:
  - **name** = English, **name_nt** = native-language name, **name_ua** = Ukrainian.
  - **region_id** = the ISO-3166-2 region the city sits in (e.g. `BG-23`). It MUST already
    exist in `area[]` for that country: `grep -n '"region_id": "BG-' DATA/globaldb.json`.
    If the country/regions aren't in the data yet, run the **add-country** skill first.
  - **lat** / **long** = decimal coordinates (geocode the place; confirm with the user if unsure).
  - **image** = `"<cc>_<slug>.jpg"` where `<cc>` is the country's 2-letter prefix used by its
    other cities (check an existing same-country city's image, e.g. `bg_sofia.jpg`). Tell the
    user to drop that photo into `IMG/`.
  - **description** = 1–3 sentences in **Ukrainian**.
  - Optional: `"capital": "true"`, `"type"` (location-type id), `lat_2`/`long_2`.

  Example city object (insert after the `  "city": [` line):
  ```json
  {
    "name": "Plovdiv",
    "name_nt": "Пловдив",
    "name_ua": "Пловдив",
    "region_id": "BG-16",
    "city_id": "plovdiv",
    "lat": "42.1354",
    "long": "24.7453",
    "image": "bg_plovdiv.jpg",
    "description": "Одне з найстаріших міст Європи, культурна столиця Болгарії..."
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
`RESULT: OK` and that the new cities/visit resolve cleanly. Remind the user to add the city
photo(s) to `IMG/`.

## Rules
- Touch only `city[]` and `visit[]`. Never invent a `region_id` that isn't in `area[]`.
- Reuse existing cities (don't duplicate a `city_id`).
- Keep names in all three languages; descriptions in Ukrainian.
