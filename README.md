# quetzal-trv — «Будинок пернатого равлика»

A personal, client-side web app that visualizes the countries and places I have visited:
an interactive world map, per-country / per-location pages, travel stories, a statistics
dashboard, an About page, and a settings UI for editing the underlying data. The interface
is in Ukrainian, with a light / dark / auto theme toggle. No build step, no backend — just
static files.

## Running locally

The app loads its data with `$.getJSON("DATA/...")`, so it must be served over HTTP
(opening `index.html` directly via `file://` will fail on those fetches). Serve the
project root with any static server, for example:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000/index.html
```

(In JetBrains IDEs the built-in server runs on port 63342.)

`index.html` is the entry point; `map.html` renders a single country map and is opened
in a new tab from the country / location / settings views.

## Pages

- **Home** — world map (AMmap) with the list of visited countries / visits / places lived
  ("Моє життя" — shown for any residence-type stay, see below).
- **Statistics** — data-driven dashboard (summary, records, donut charts, per-year and
  trend charts, top lists incl. residence-aware time-spent per country/city).
- **Stories** — long-form trip reports (`DATA/stories/*.xml`).
- **Country / Location** — per-entity pages with map, flag/emblem, regions and places; a
  country also gets a "Моє життя" tab + residence-time summary if you lived there.
- **About** — about page.
- **Settings** — CRUD UI for the data model (see below).

## Data model (`DATA/globaldb.json`)

One JSON file holds all travel data as parallel arrays:

| key            | entity        | notes |
|----------------|---------------|-------|
| `country_type` | country type  | recognized / partially recognized / unrecognized / dependent territory |
| `type`         | location type | city, lake, river, mountain, castle… |
| `continent`    | continent     | |
| `country`      | country       | `country_type_id`, `continent_id` (+ optional `continent_id2`), flag/emblem/map images, optional `city_state` flag |
| `area`         | region        | (referred to as "region" in code); `active` flag controls whether it shows on the country map |
| `city`         | city / place  | belongs to an `area`; `capital`, optional `type`, `lat`/`long` (+ optional second pair), `image`, `description` |
| `visit`        | a trip        | dates + list of `city_id`s; optional `photos`, `story`, and `days` (per-place day allocation); optional `visit_type: "residence"` marks long-term living instead of a trip (single city, `end_date: ""` = ongoing) |

A place is linked to its country only through its region: `city → area → country`.

Names use three language fields throughout: **`name`** = English, **`name_nt`** = native
(local language), **`name_ua`** = Ukrainian.

`DATA/onload.json` is a denormalized subset (continents + countries) used for a fast
initial render of the home page. `DATA/stories/*.xml` are the long-form trip reports.

> The file is CRLF, no BOM — preserve that when editing programmatically.

## Settings (CRUD tabs)

`Overview` (KPI cards + per-continent countries table, incl. a "Резидент" ✓/— column),
`Country types`, `Location types`, `Continents`, `Countries`, `Regions`, `Locations`,
`Visits`, `Stories`. The entity tabs share a common modern form pattern: pick-or-add
`<select>`, read-only IDs on edit, **Save** enabled only after a change, and a dependency
guard that blocks deletion / ID change while other entities still reference the item.
`set_content.js` holds the shared add / update / remove logic. The Visits form has a
"Резиденс-візит" checkbox that switches a trip into a residence entry and caps it to one
city while checked.

## Tech stack

- HTML / CSS, vanilla JavaScript + **jQuery 3.7.1** (CDN, pinned with SRI)
- **Bootstrap 3.4.1** (vendored locally) + `bootstrap-datepicker` (CDN, SRI)
- [amCharts / AMmap](https://www.amcharts.com/javascript-maps/) for the maps
- `jquery.fcbkcomplete` multi-select widget (settings)
- **Inter** font, self-hosted (`THEMES/fonts.css`, no Google Fonts CDN)
- Light / dark / auto theme via CSS variables; no build step / no bundler

## Project layout

```
index.html, map.html      entry points
robots.txt, sitemap.xml   SEO (sitemap generated from globaldb.json)
SCRIPTS/
  bcd_onload.js           bootstrap + router: loads JSON, lazy-loads modules, setPageMeta()
  bcd-content.js          builds the in-memory objects (Country/Region/City/Visit)
  bcd_services.js         shared helpers
  trv_world.js            home / world map
  trv_country.js          country page
  trv_city.js             location page
  trv_story.js            story page
  trv_statistics.js       statistics dashboard
  set_overview.js         settings shell + overview (KPIs, countries table)
  set_content.js          shared CRUD data logic (add / update / remove)
  set_*.js                settings CRUD tabs (country_type, type, continent,
                          country, region, city, visit, story)
  MAPS/                   AMmap (ammap.js) + custommap.js + vendored map data
DATA/                     globaldb.json, onload.json, stories/*.xml
THEMES/
  global.css              custom modern theme (loaded last; ?v= cache-busted)
  fonts.css               self-hosted Inter @font-face
  fonts/inter/            Inter woff2 subsets
  bootstrap-3.4.1/        vendored Bootstrap (dist only)
  dashboard.css, fcbkcomplete.css
IMG/                      flags, emblems, city photos, icons / favicons
```

## Deploy & cache-busting

Live site: `https://quetzal.epizy.com/` (InfinityFree, static files in `htdocs/`).

### How deploy works

Deploy is automatic: **every push to `master` (i.e. every merge into it) triggers the
GitHub Actions workflow `.github/workflows/deploy.yml`**, which uploads the repo over FTP
(`SamKirkland/FTP-Deploy-Action`). Only changed files are uploaded; the action keeps a
`.ftp-deploy-sync-state.json` on the server for that - do not delete it. Excluded from
upload: `.git*`, `.github/`, `.claude/`, `.idea/`, `*.iml`, `CLAUDE.md`, `README.md`, `tools/`.

Credentials live in the repo secrets `FTP_SERVER`, `FTP_USER`, `FTP_PASS`
(GitHub -> Settings -> Secrets and variables -> Actions).

Release steps:

1. Work on a feature branch (e.g. `site_version_9_4`). If JS/CSS changed, bump the version
   (see below); pure `DATA/*.json` / docs changes need no bump.
2. Merge the branch into `master` and push `master`:
   `git checkout master && git merge site_version_9_4 && git push origin master`
3. The deploy starts by itself. A manual run is also possible: GitHub -> Actions ->
   "Deploy to InfinityFree" -> Run workflow (pick `master`).

### How to check the deploy status

- GitHub -> **Actions** tab -> workflow "Deploy to InfinityFree": green check = uploaded,
  red cross = failed (open the run and the "Upload via FTP" step for the log).
  With GitHub CLI: `gh run list --workflow deploy.yml --limit 5`, `gh run watch`.
- On the site: hard-refresh (Ctrl+F5) and check the version tag (`vX.Y.Z`) on the About
  page; it must equal the version bumped in the release. Or open DevTools -> Network and
  confirm `bcd_onload.js?v=X.Y.Z`.
- If the Actions run is green but the site is stale: browser/CDN cache - hard-refresh;
  for data-only changes (no version bump) the JSON is fetched with cache-busting anyway.
- Common failures: wrong/expired FTP secrets (login error in the log), InfinityFree FTP
  timeouts (just re-run the workflow).

### Version / cache-busting

Statically-tagged assets in `index.html` carry a `?v=X.Y.Z` query; `APP_V` in
`SCRIPTS/bcd_onload.js` adds the same `?v=` to every lazy-loaded script (`$.getScript`).
Bump the patch on each deploy with JS/CSS changes, in four places: `index.html` (`?v=`),
`SCRIPTS/bcd_onload.js` (`APP_V`), `SCRIPTS/bcd_services.js` (`tech-tag` span, shown on
the About page) and `CLAUDE.md` (current version).

## Roadmap

Planned improvements. How to use: `- [ ]` — planned, `- [x]` — top priority. Add new items
at the bottom of the relevant category; sketch big ideas as sub-bullets.

### UI / UX
- [ ] ...

### Data / content
- [ ] ...

### Technical
- [ ] Update AMmap library to the latest version
```
