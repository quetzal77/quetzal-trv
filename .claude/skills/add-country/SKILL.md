---
name: add-country
description: >
  Add a new country and all its regions to quetzal-trv's DATA/globaldb.json, sourcing the
  region list from the bundled ammap map (SCRIPTS/MAPS/ammap_3.21.14/<country>Low.js).
  Creates the `country` entry plus one `area` (region) entry per province/region —
  region_id + English name come straight from the map, name_ua is translated to Ukrainian.
  Use when you visited a country that isn't in globaldb.json yet and need it added with
  its regions before adding cities/visits.
---

# add-country

Adds a country and its regions. Regions are taken from the matching ammap map so the
`region_id`s line up with what the on-site maps highlight.

## Inputs to gather (ask the user if not given)
- **Country** (which one) and its ammap map file name, e.g. `bulgaria` → `bulgariaLow.js`.
  List candidates with: `ls SCRIPTS/MAPS/ammap_3.21.14/ | grep -i <name>`
- **country_id**: the project's id (mostly ISO alpha-2, e.g. `BG`; a few custom like `ABH`).
- **short_name**: lowercase English slug (e.g. `bulgaria`) — used in URLs and flag lookups.
- **name** (English), **name_ua** (Ukrainian), **name_nt** (native-language name).
- **continent_id**: one of the existing continents (`EU`,`AS`,`AF`,`NA`,…); add `continent_id2` only if it spans two.
- Optional assets: **small_flag_img** (CSS sprite coords like `"-158px -55px"`), **flag_img**,
  **emb_img** (filenames under `IMG/flag_n_emblem/`). If unknown, leave `""` and tell the user to fill later.

## Steps

1. **Extract regions** from the ammap map:
   ```
   python .claude/skills/add-country/extract_regions.py SCRIPTS/MAPS/ammap_3.21.14/<country>Low.js
   ```
   This prints `[[region_id, english_title], ...]`. Sanity-check the count.

2. **Build the country entry** (match existing field order):
   ```json
   {
     "country_id": "BG",
     "continent_id": "EU",
     "name": "Bulgaria",
     "name_ua": "Болгарія",
     "name_nt": "България",
     "short_name": "bulgaria",
     "small_flag_img": "",
     "flag_img": "",
     "emb_img": "",
     "map_img": "bulgariaLow.js"
   }
   ```
   Insert it right after the `  "country": [` line (Edit: match that line, append the object as the first element with a trailing comma).

3. **Build one area entry per region**, translating each English title to Ukrainian:
   ```json
   { "country_id": "BG", "region_id": "BG-01", "name": "Blagoevgrad", "name_ua": "Благоєвград", "active": "Y" }
   ```
   Insert all of them right after the `  "area": [` line.

4. **Copy the map file** into the runtime maps folder (the app loads `SCRIPTS/MAPS/<map_img>`):
   ```
   cp SCRIPTS/MAPS/ammap_3.21.14/<country>Low.js SCRIPTS/MAPS/<country>Low.js
   ```

5. **Normalize line endings + validate JSON** (Edit may insert LF lines into this CRLF file):
   ```
   python -c "import json;p='DATA/globaldb.json';t=open(p,encoding='utf-8').read();json.loads(t);open(p,'wb').write(('\r\n'.join(t.splitlines())+'\r\n').encode('utf-8'));print('normalized + valid')"
   ```

6. **Verify**: run the `check-data` skill (`python .claude/skills/check-data/check_data.py`).
   Then remind the user to: add the flag sprite coords / flag & emblem images, and run
   `sync-onload` (or add the country to `onload.json`) if it should appear on the home page.

## Rules
- Only touch `country[]` and `area[]`. Don't alter other entities.
- Keep each JSON object's fields consistent with existing entries; one entry per line block.
- `active` defaults to `"Y"`. Region `region_id` must be exactly the map's id (e.g. `BG-01`).
