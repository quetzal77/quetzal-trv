---
name: find-flights
description: >
  Search for holiday flights from several European departure cities to several destinations
  via Google Flights in Chrome, then build an HTML comparison report in plans/flights/.
  Starts by confirming or updating defaults (passengers, dates, destinations, departure cities,
  budget). Use when the user asks to find / compare flights, "знайди перельоти",
  "пошук перельотів", "полетіти у відпустку", or plans a trip abroad and needs fares.
---

# find-flights

Interactive flight search: confirm conditions -> search Google Flights -> HTML report.
Reference output (the format to follow): `plans/flights/2026.12_christmas_flights.html`.
Earlier plan for style/logic: `plans/flights/2026.11_flight_plans.html`.

## 1. Confirm start conditions — mandatory, one item at a time

Show the defaults below and ask the user about **each item separately**: "підтверджуєш чи є нові дані?"
Use AskUserQuestion (one question per item, up to 4 per call; options: "Підтверджую" + the
likely alternative; the user can always type "Other"). Do NOT search until every item is confirmed or updated.

| # | Item | Default (from last run) |
|---|---|---|
| 1 | Passengers | 4: 2 adults + 2 children (10 and 13 years) |
| 2 | Dates | Ask for the **departure window** and the **return rule** separately. Last run: departure any day 24.12-30.12.2026; return = cheapest possible in 2027, not later than 18.01.2027 (open window, not a fixed return date). Offer the alternative: fixed return date |
| 3 | Destinations | Dominican Republic (PUJ), Sri Lanka (CMB), Thailand (BKK/DMK), Vietnam (HAN), Malaysia (KUL), French Caribbean (Guadeloupe PTP, Martinique FDF) |
| 4 | Departure cities | Zagreb (ZAG), Vienna (VIE), Budapest (BUD), Ljubljana (LJU), Belgrade (BEG), Munich (MUC) |
| 5 | Budget | up to EUR 600 per person, round trip, economy |

Also known (state it, ask only if it changed): citizenship Ukraine, home city Zagreb.
Today's date comes from the environment; if the dates are in the past, ask again.
After confirmation, print the final conditions as a short list and proceed.

## 2a. Date windows: use Kiwi (when departure or return is a range)

Google Flights cannot search a range for both legs. For ranges use Kiwi with `<from>_<to>` date ranges:

```
https://www.kiwi.com/en/search/results/<origin>/<dest>/<out_from>_<out_to>/<ret_from>_<ret_to>?sortBy=price&currency=EUR&transportTypes=FLIGHT
```
e.g. `.../vienna-austria/colombo-sri-lanka/2026-12-24_2026-12-30/2027-01-01_2027-01-18?...`

Per search: navigate -> `computer wait 10` (**max 10 s per wait**) -> `javascript_tool`:
```js
var t=document.body.innerText;var i=t.indexOf('Best');document.title+' || '+t.slice(i,i+560).replace(/\n+/g,' | ')
```
It returns `Best / Cheapest / Fastest` price + total travel time (both ways summed) and the first card (out/back dates, stops, nights, "Self-transfer" label). If the title shows a different city or `Loading`, the page did not switch: re-run that search alone with a longer wait. A bad slug redirects to the Kiwi home page (pathname `/en/`).

Slugs: `zagreb-croatia`, `vienna-austria`, `budapest-hungary`, `ljubljana-slovenia`, `belgrade-serbia`, `munich-germany`;
`punta-cana-dominican-republic`, `colombo-sri-lanka`, `bangkok-thailand`, `hanoi-vietnam`, `kuala-lumpur-malaysia`,
`pointe-a-pitre-guadeloupe-france`, `fort-de-france-martinique-france`, `tokyo-japan` (NRT + HND), `tbilisi-georgia`, `dubai-united-arab-emirates`.
Slugs without the `-france` suffix do NOT work for the French islands.

Report both "Cheapest" and "Best" per origin/destination. "Cheapest" is often many stops, 50-85 h total and
self-transfer (separate tickets) and can have very short stays (3-6 nights) — flag these. Mark a ticket as "один квиток"
only if the card has no "Self-transfer" label; otherwise "окремі квитки"; if the card was cut off, "не визначено".

## 2. Search via Google Flights (Chrome) — fixed dates

Tools: load with ToolSearch `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__get_page_text`.
Call `tabs_context_mcp` with `createIfEmpty: true` first; use that tab. Close it when done.

Natural-language URL works (prices are per **1 adult**, round trip, EUR):

```
https://www.google.com/travel/flights?q=Cheapest%20flights%20from%20<ORIGIN>%20to%20<DEST>%20on%20<YYYY-MM-DD>%20through%20<YYYY-MM-DD>&curr=EUR&hl=en
```

Destination text that resolves reliably: `Bangkok`, `Colombo`, `Hanoi`, `Kuala%20Lumpur`, `Punta%20Cana`,
`Pointe-a-Pitre%20Guadeloupe`, `Fort-de-France%20Martinique`, `Dubai`, `Tbilisi`.

Use `browser_batch` with 6-8 searches per call to keep it fast. Per search, three steps:
navigate -> `computer wait 4` -> `javascript_tool` extracting only the top rows:

```js
var t=document.body.innerText;var i=t.indexOf('Sorted by');t.slice(i,i+600).replace(/\n+/g,' | ')
```

Notes:
- The list is sorted by price. The header "from" value can differ from the list (other dates) — use list rows only.
- Row fields: times, airlines, duration, `ORIG-DEST`, stops, layover airport + duration, price, "round trip".
- Keep the cheapest row plus 1 more useful one (shorter / fewer stops) per origin.
- Skip rows tagged Business Class / Premium or "Flight + Train" unless they are the only option.
- Page can return few rows (e.g. Ljubljana to Caribbean: 1 row) — report that as "єдиний варіант".
- For 4 passengers add `for 4 passengers` to the query only when the user asks for a family total; otherwise multiply per-person x4 and say it is an estimate.
- Expect the search results text to be in English even with `hl=uk`; translate to Ukrainian in the report.
- If a run reveals nothing within budget, also check: cheaper nearby destinations (Dubai, Tbilisi, Istanbul, Yerevan), date flexibility (+-1-2 days), and add them as a separate "в бюджеті" block.
- Kiwi (`kiwi.com/en/search/results/<from>/<to>/<d1>/<d2>?sortBy=price&currency=EUR`) works as a cross-check; Skyscanner usually does not finish loading — do not rely on it.
- Do not click any booking links, do not enter personal data.

## 3. Build the HTML report

File: `plans/flights/<YYYY>.<MM>_<slug>_flights.html` (year.month of the **travel** date, slug from the trip, e.g. `2026.12_christmas_flights.html`). Do not overwrite an existing file — add a suffix.
Single self-contained file: inline CSS, light/dark via `prefers-color-scheme`, no external fonts or scripts, readable on a phone (tables in `.tablewrap` with `overflow-x:auto`). Copy the CSS from `2026.12_christmas_flights.html`.
Language: Ukrainian. Date format DD.MM.YYYY, currency EUR, "год"/"хв" for durations.

Sections, in this order:
1. **Умови на старті** — passengers, dates, budget, class, citizenship, price source + check date. Then a warning/OK banner: does anything fit the budget (state the cheapest price and by how much it exceeds the limit).
2. **Зведена таблиця** — rows = destinations, columns = departure cities, cell = lowest per-person price; highlight the lowest row. One line under it naming the 3-4 cheapest combos.
3. **Table per destination** — columns: Виліт з | Ціна | Перевізники та пересадки (layover airport + duration) | Час у дорозі. Per city 1-2 rows (cheapest first, class `best`; second row class `sub`).
4. **Що вкладається в бюджет (поза списком)** — only if you searched extra destinations.
5. **Нотатки** — per-person vs family price, flexible-date savings, baggage fees, visa checks for Ukrainians (mark unverified ones as "перевірити"), very long layovers.

Rules:
- Only prices actually read from the pages. Never invent or estimate a fare; mark gaps as "немає даних".
- State clearly that prices change daily and must be rechecked before booking.

## 3b. Register in the plans index

Add a link to the new report in `plans/index.html` under the "Перельоти" heading (newest first), same shape as the existing entries:
`<a href="flights/<file>.html" data-title="<title>">Short name<small>subtitle</small></a>`.

## 4. Wrap up

Tell the user: file path, the cheapest result per destination, whether anything fits the budget, and offer a
follow-up (flexible dates, extra destinations, family-total check). No commit/push unless asked
(`/finish-session` handles that; HTML in `plans/` does not need a version bump).
