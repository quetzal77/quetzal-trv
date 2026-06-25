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

- **Home** — world map (AMmap) with the list of visited countries / visits.
- **Statistics** — data-driven dashboard (summary, records, donut charts, per-year and
  trend charts, top lists).
- **Stories** — long-form trip reports (`DATA/stories/*.xml`).
- **Country / Location** — per-entity pages with map, flag/emblem, regions and places.
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
| `visit`        | a trip        | dates + list of `city_id`s; optional `photos`, `story`, and `days` (per-place day allocation) |

A place is linked to its country only through its region: `city → area → country`.

Names use three language fields throughout: **`name`** = English, **`name_nt`** = native
(local language), **`name_ua`** = Ukrainian.

`DATA/onload.json` is a denormalized subset (continents + countries) used for a fast
initial render of the home page. `DATA/stories/*.xml` are the long-form trip reports.

> The file is CRLF, no BOM — preserve that when editing programmatically.

## Settings (CRUD tabs)

`Overview` (KPI cards + per-continent countries table), `Country types`, `Location types`,
`Continents`, `Countries`, `Regions`, `Locations`, `Visits`, `Stories`. The entity tabs
share a common modern form pattern: pick-or-add `<select>`, read-only IDs on edit, **Save**
enabled only after a change, and a dependency guard that blocks deletion / ID change while
other entities still reference the item. `set_content.js` holds the shared add / update /
remove logic.

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

Deployed as static files to `https://quetzal.epizy.com/`. Statically-tagged assets
(`SCRIPTS/bcd_onload.js`, `THEMES/global.css`, `THEMES/fonts.css`) carry a `?v=X.Y.Z`
query that is bumped on each deploy to bust the browser cache; the same version shows on
the About page. All other scripts are lazy-loaded via `$.getScript`, which auto-busts the
cache, so they don't need a `?v=`.

## Roadmap

Planned improvements. How to use: `- [ ]` — planned, `- [x]` — top priority. Add new items
at the bottom of the relevant category; sketch big ideas as sub-bullets.

### UI / UX
- [ ] Add second language to portal - English

### Data / content
- [ ] Introduce live visit type for cities that user is living in, that will influence on Statistic calculation

### Technical
- [ ] Update AMmap library to the latest version
```
