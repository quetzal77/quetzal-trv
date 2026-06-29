---
name: add-country
description: >
  Add a new country and all its regions to quetzal-trv's DATA/globaldb.json, sourcing the
  region list from the bundled ammap map (SCRIPTS/MAPS/ammap_3.21.14/<country>Low.js).
  Creates the `country` entry, one `area` entry per region, and the capital `city` entry.
  Use when you visited a country that isn't in globaldb.json yet and need it added with
  its regions before adding cities/visits.
---

# add-country

Adds a country, its regions, and capital city. Map file is the source of truth for region IDs.

## Step 1 — Find the map file

Search for the country in `SCRIPTS/MAPS/ammap_3.21.14/`:
```
ls SCRIPTS/MAPS/ammap_3.21.14/ | grep -i <country_name>
```

**Selection priority:**
1. `<name>Low.js` — preferred (Low detail = smaller file, used for country pages)
2. Any other variant (`High.js`, etc.) — if Low is absent
3. **No file found** → stop. Ask the user:
   > Карту для «<country>» не знайдено в `SCRIPTS/MAPS/ammap_3.21.14/`.
   > Надайте ім'я файлу карти або покладіть файл у цю папку і підтвердіть.
   Do not proceed until the user provides a file name and it exists on disk.

## Step 2 — Copy the map to the runtime folder

The app loads maps from `SCRIPTS/MAPS/` directly. Copy the chosen file one level up:
```
cp SCRIPTS/MAPS/ammap_3.21.14/<chosen_file> SCRIPTS/MAPS/<chosen_file>
```
Note the file name — it becomes the `map_img` field in the country entry.

## Step 3 — Extract regions

```
python .claude/skills/add-country/extract_regions.py SCRIPTS/MAPS/ammap_3.21.14/<chosen_file>
```

This prints `[[region_id, english_title], ...]`. Verify the count looks reasonable for
the country (e.g. 16 for Bulgaria, 20 for Italy). If the count is 0 or suspiciously low,
stop and report — the map file may be malformed.

**Region ID format**: every `region_id` must be two-part: `CC-XX` where `CC` is the
country code and `XX` is the region identifier (e.g. `BG-01`, `SI-LJ`). Some ammap files
for single-territory islands output just the country code (e.g. `"IM"` for Isle of Man) —
`extract_regions.py` auto-fixes these to `CC-01` with a WARNING. Do not use bare
country-code region_ids: they collide with other maps that show the same territory as a
region of a parent country.

**Check for region_id conflicts.** After extracting, run:
```python
python -c "
import json, sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
new_ids = <list of extracted region_ids>
db = json.load(open('DATA/globaldb.json', encoding='utf-8'))
for r in db['area']:
    if r['region_id'] in new_ids:
        print('CONFLICT:', r['region_id'], 'used by country_id', r['country_id'])
"
```
If a conflict is found (same `region_id` already used by another country's map, e.g. island
territories that appear on a parent country's map): set that existing area entry to
`"active": "N"` — do NOT delete it. The new country's entry takes over the ID.

## Step 4 — Gather country metadata

Ask the user for any fields not already known:
- **country_id**: ISO alpha-2 code (e.g. `SI`); a few custom ones like `ABH` for Abkhazia
- **country_type_id**: `1` = Recognized · `2` = Partly recognized · `3` = Unrecognized · `4` = Dependent territory (default: `1`)
- **continent_id**: `EU` · `AS` · `AF` · `NA` · `SA` · `OC` · `AN`; add `continent_id2` only if the country spans two continents
- **name** (English), **name_ua** (Ukrainian), **name_nt** (native-language name)
- **short_name**: lowercase ASCII slug (e.g. `slovenia`) — used in URLs and as the in-memory key
- **small_flag_img**, **flag_img**, **emb_img**: CSS sprite coords / filenames under `IMG/flag_n_emblem/`. Leave `""` if unknown — tell the user to fill later.

## Step 5 — Add the country entry to `country[]`

Insert right after the `  "country": [` line. Field order must match existing entries exactly:
```json
{
  "country_id": "SI",
  "country_type_id": "1",
  "continent_id": "EU",
  "name": "Slovenia",
  "name_ua": "Словенія",
  "name_nt": "Slovenija",
  "short_name": "slovenia",
  "small_flag_img": "",
  "flag_img": "",
  "emb_img": "",
  "map_img": "sloveniaLow.js"
}
```

## Step 6 — Add area entries to `area[]`

For each `[region_id, english_title]` pair from Step 3, build one entry and translate
the English title to Ukrainian (`name_ua`). Insert all of them right after the `  "area": [` line.

Field order: `country_id`, `region_id`, `name`, `name_ua`, `active`:
```json
{ "country_id": "SI", "region_id": "SI-LJ", "name": "Osrednjeslovenska", "name_ua": "Центральна Словенія", "active": "Y" }
```

## Step 7 — Add the capital city entry to `city[]`

Gather the capital city data:
- **name** (English), **name_nt** (native), **name_ua** (Ukrainian)
- **city_id**: lowercase ASCII slug of the English name
- **region_id**: the region the capital sits in (pick from the extracted list)
- **lat** / **long**: decimal coordinates
- **description**: 2–4 sentences in **Ukrainian**, naming specific landmarks and sights —
  generic text is not acceptable.
- `"capital": "true"` — mandatory for the capital

Do NOT add the `image` field unless the user explicitly requests it.

Find the country's position in `city[]` — cities are grouped by country. Since this is a
new country with no existing cities, insert right after the `  "city": [` line.

Field order: `name`, `name_nt`, `name_ua`, `city_id`, `region_id`, `capital`, `lat`, `long`, `description`:
```json
{
  "name": "Ljubljana",
  "name_nt": "Ljubljana",
  "name_ua": "Любляна",
  "city_id": "ljubljana",
  "region_id": "SI-LJ",
  "capital": "true",
  "lat": "46.051244",
  "long": "14.503061",
  "description": "Столиця Словенії. Фортеця Град, барокове Старе місто, мости Плечника, Народна галерея та Національний музей."
}
```

## Step 8 — Normalize line endings + validate JSON

```
python -c "import json;p='DATA/globaldb.json';t=open(p,encoding='utf-8').read();json.loads(t);open(p,'wb').write(('\r\n'.join(t.splitlines())+'\r\n').encode('utf-8'));print('normalized + valid')"
```

## Step 9 — Verify

Run `python .claude/skills/check-data/check_data.py` — confirm `RESULT: OK`.

Remind the user:
- Add flag sprite coords and flag/emblem images to `IMG/flag_n_emblem/`
- Capital city photo: `IMG/<cc>_<slug>.jpg` (only if image field was requested)

## Rules

- Touch only `country[]`, `area[]`, and `city[]`. Never alter other arrays.
- `region_id` must exactly match the map's id — never invent one.
- Keep all three name languages; descriptions in Ukrainian with real landmarks.
- `active` defaults to `"Y"` for all regions.
- Never add `image` field to a city unless explicitly requested.
- If any step is ambiguous (wrong map match, region count mismatch, etc.) — stop and ask.