# quetzal-trv — «Будинок пернатого равлика»

A personal, client-side web app that visualizes the countries and cities I have visited:
interactive maps, per-country / per-city pages, travel stories, and a settings UI for
editing the underlying data. No build step, no backend — just static files.

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
in a new tab from city/visit views.

## Data model (`DATA/globaldb.json`)

One JSON file holds all travel data as parallel arrays:

| key         | entity        | notes |
|-------------|---------------|-------|
| `type`      | location type | lake, river, mountain… |
| `continent` | continent     | |
| `country`   | country       | |
| `area`      | region        | (referred to as "region" in code) |
| `city`      | city / place  | belongs to an `area` |
| `visit`     | a trip        | dates + list of `city_id`s, optional photos/story |

Names use three language fields throughout: **`name`** = English, **`name_nt`** = native
(local language), **`name_ua`** = Ukrainian.

`DATA/onload.json` is a denormalized subset (continents + countries) used for a fast
initial render of the home page. `DATA/stories/*.xml` are long-form trip reports shown on
story pages.

## Tech stack

- HTML / CSS, vanilla JavaScript + jQuery 3.2
- [Bootstrap 3.3.7](https://getbootstrap.com/) (theme), `bootstrap-datepicker`
- [amCharts / AMmap](https://www.amcharts.com/javascript-maps/) for the maps
- `jquery.fcbkcomplete` multi-select widget

## Project layout

```
index.html, map.html      entry points
SCRIPTS/
  bcd_onload.js           bootstrap: loads JSON, lazy-loads page modules
  bcd-content.js          builds the in-memory data objects
  bcd_services.js         shared helpers
  trv_*.js                view pages (world / country / city / story)
  set_*.js                settings (CRUD) tabs
  MAPS/                   vendored AMmap map data
DATA/                     globaldb.json, onload.json, stories/*.xml
THEMES/                   global.css + vendored Bootstrap
IMG/                      flags, emblems, city photos
```

## Плани (Roadmap)

Список запланованих покращень. Як користуватись:
`- [ ]` — заплановано, `- [x]` — перший пріоритет. Додавай нові пункти знизу відповідної
категорії; великі ідеї коротко описуй у підпунктах.

### UI / UX
- [ ] Add Login for settings
- [ ] Mobile web view testing / Compatibility / Chrome, Edge, Safari, AdnroidDefaultBrowser
- [ ] Add second language to portal - English
- [ ] Скрипт валідації globaldb.json: Node-скрипт, що перевіряє: CRLF/відсутність BOM, схему полів, цілісність звʼязків (city.region_id → area → country), валідність map_img (регістр!), коректність days (типи,   
  ключі в маршруті, сума ≈ тривалості).

### Дані / контент
- [ ] ...

### Технічне
- [ ] Автогенерація `onload.json` з `globaldb.json` (щоб не редагувати вручну)
- [ ] Експорт/бекап даних


