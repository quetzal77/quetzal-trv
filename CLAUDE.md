# quetzal-trv — Project Brief for Claude

Personal travel portfolio SPA by Oleksiy Slavutskyy. No backend, no build step.
Current version: **9.2.2** (branch `site_version_9_0`).

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Static files served from Apache (epizy.com free host) |
| JS | ES5 — jQuery 3.7.1, Bootstrap 3.4.1 |
| Maps | AMmap (custom, loaded on demand via `$.getScript`) |
| Fonts | Self-hosted Inter (no Google Fonts) |
| Build | None — edit files directly, bump `?v=` to bust cache |

**No `let`/`const`, no arrow functions, no modules, no npm.** Everything is `var` and `function`.

---

## File layout

```
index.html            — single HTML shell; all pages render into #mainSection
SCRIPTS/
  bcd_onload.js       — bootstrap: loads globaldb.json, builds global state, wires nav
  bcd-content.js      — data objects: VisitObj, CityObj, CountryObj, RegionObj etc.
  bcd_services.js     — shared helpers: getVisitDate(), getUaMonthName(), parseWord()…
  trv_*.js            — read-only travel pages (world, country, city, story, stats)
  set_*.js            — settings/CRUD pages (overview, visit, city, region, country…)
THEMES/
  global.css          — main custom styles (loaded last, overrides Bootstrap)
  fonts.css           — Inter font-face declarations
  dashboard.css       — Bootstrap dashboard base
DATA/
  globaldb.json       — master database (≈1.9 MB, CRLF, hand-maintained)
  onload.json         — denormalised subset for fast home-page render
  stories.json        — story index (id + title + date per story)
  stories/<id>.json   — individual trip story files
IMG/                  — city/country photos, flags, icons
.claude/skills/       — Claude Code skills (see Skills section)
```

---

## Data model (`DATA/globaldb.json`)

Seven parallel arrays — no foreign-key enforcement, references are string IDs:

| Array | Count | Key field | Notes |
|---|---|---|---|
| `continent` | 7 | `continent_id` | e.g. `"EU"`, `"AS"` |
| `country` | 71 | `country_id` | ISO 3166-1 alpha-2 |
| `area` | 1628 | `region_id` | ISO 3166-2, e.g. `"UA-30"` |
| `city` | 1165 | `city_id` | lowercase ASCII slug |
| `visit` | 287 | — | `city[]` = array of city_id strings |
| `type` | 22 | `type_id` | location types (lake, island…) |
| `country_type` | 4 | `country_type_id` | recognised / partially / unrecognised… |

**Three-language name convention** (used on every entity):
- `name` = English
- `name_nt` = native language of the country
- `name_ua` = Ukrainian ← primary display language

**Reference chain:** `visit.city[]` → `city.city_id` → `city.region_id` → `area.region_id` → `area.country_id` → `country.country_id` → `country.continent_id` → `continent.continent_id`

**`country.short_name`** is the slug used in URLs and as the in-memory country key (not `country_id`).

**`globaldb.json` line endings are CRLF.** After any edit, normalise:
```
python -c "p='DATA/globaldb.json';t=open(p,encoding='utf-8').read();import json;json.loads(t);open(p,'wb').write(('\r\n'.join(t.splitlines())+'\r\n').encode('utf-8'));print('ok')"
```

---

## Global JS state (available everywhere after load)

```js
data              // parsed globaldb.json object
visitsSorted[]    // VisitObj[], descending by date; .start_date/.end_date are Date objects
countriesVisited[]// CountryObj[] — countries that have ≥1 visit
regionsVisited[]  // RegionObj[]
citiesVisited[]   // CityObj[]
local[]           // current page context: local[1].type = "world"|"country"|"city"|"settings"…
```

---

## Version bumping

Three files share the same `?v=X.Y.Z` cache-buster:
```
THEMES/fonts.css?v=…
SCRIPTS/bcd_onload.js?v=…
THEMES/global.css?v=…
```

**Bump the patch** (`Z+1`) whenever JS or CSS changes are deployed.  
**Do not bump** if only `DATA/*.json`, `.claude/`, or `README.md` changed.

Quick replace (PowerShell):
```powershell
(Get-Content index.html -Raw) -replace '\?v=9\.1\.27',  '?v=9.1.28' | Set-Content index.html
```

---

## Code rules

- **ES5 only** — no template literals, no `let`/`const`, no arrow functions, no `class`.
- **ASCII apostrophes only in JS strings** — the Edit tool sometimes inserts curly quotes (`'` U+2018/`'` U+2019). They cause `SyntaxError`. Scan after edits:
  ```python
  python -c "
  raw=open('SCRIPTS/set_overview.js','rb').read()
  bad=[i for i in range(len(raw)) if raw[i:i+3] in (b'\xe2\x80\x98',b'\xe2\x80\x99')]
  print('CURLY QUOTES at bytes:',bad or 'none')
  "
  ```
  Then verify with: `node --input-type=module < SCRIPTS/set_overview.js`
- **CRLF in globaldb.json** — normalise after every edit (command above).
- **No comments** unless the WHY is non-obvious.
- **Download pattern** (no backend): `URL.createObjectURL(new Blob([...]))` + temp `<a>` click.
- **Fetch pattern**: `$.ajax({ url, dataType: 'text', cache: false })` for raw text; `$.getJSON(url)` for JSON.

---

## Key files to know

| File | Purpose |
|---|---|
| `SCRIPTS/set_overview.js` | Settings overview: KPI cards, data-ops buttons (onload gen, stories gen, validate, PDF/CSV export) |
| `SCRIPTS/bcd_services.js` | `getVisitDate()`, `getUaMonthName()`, `parseWord()`, `dynamicSort()` |
| `SCRIPTS/bcd-content.js` | All object constructors + `createArrayOfVisitesAndArrayOfCitiesVisited()` |
| `THEMES/global.css` | All custom CSS — add new utility classes here |

---

## Skills (`/skill-name`)

| Skill | When to use |
|---|---|
| `/add-visit` | User visited somewhere — add city + visit entry to globaldb.json |
| `/add-country` | Country not yet in DB — add continent/country/regions |
| `/check-data` | Run structural integrity check on globaldb.json |
| `/finish-session` | End of work — bump version, commit, push |

---

## Workflow reminders

- After editing `globaldb.json`: normalise CRLF → run `/check-data`.
- After editing JS/CSS: check for curly quotes → syntax-check with node → bump `?v=`.
- To end session: `/finish-session` handles version bump + commit + push.
- Branch: `site_version_9_0` → merges to `master` for releases.