#!/usr/bin/env python3
"""Read-only integrity check for quetzal-trv data files.
Usage: python .claude/skills/check-data/check_data.py
Run from the project root. Exits non-zero if any ERROR is found (warnings don't fail).
"""
import json, os, re, sys

ROOT = os.getcwd()
GDB = os.path.join(ROOT, "DATA", "globaldb.json")
ONLOAD = os.path.join(ROOT, "DATA", "onload.json")
IMG = os.path.join(ROOT, "IMG")
MAPS = os.path.join(ROOT, "SCRIPTS", "MAPS")

errors, warns, accepted = [], [], []
def err(m): errors.append(m)
def warn(m): warns.append(m)

# Known, intentional duplicate region_ids — reported as accepted exceptions, not errors.
# The British Sovereign Base Areas (Akrotiri / Dhekelia) appear on both the Cyprus (CY)
# and Northern Cyprus (CT) ammap maps, so the same region_id is kept under both countries
# on purpose. Add a region_id here to whitelist a deliberate duplicate.
ACCEPTED_DUPLICATE_REGION_IDS = {"GB-AX", "GB-DX"}

# --- load + structural ---
raw = open(GDB, "rb").read()
crlf = sum(1 for l in raw.split(b"\n") if l.endswith(b"\r"))
total = len(raw.split(b"\n")) - 1
if crlf != total:
    warn(f"globaldb.json line endings: {crlf}/{total} are CRLF (mixed endings)")
try:
    data = json.loads(raw.decode("utf-8"))
except Exception as e:
    print("ERROR: globaldb.json is not valid JSON ->", e)
    sys.exit(2)

continents = data.get("continent", [])
countries  = data.get("country", [])
areas      = data.get("area", [])
cities     = data.get("city", [])
visits     = data.get("visit", [])

cont_ids = {c.get("continent_id") for c in continents}
country_ids = {c.get("country_id") for c in countries}
region_ids = {a.get("region_id") for a in areas}
city_ids = {c.get("city_id") for c in cities}

def dups(items, key):
    seen, d = set(), set()
    for it in items:
        v = it.get(key)
        if v in seen: d.add(v)
        seen.add(v)
    return d

for name, items, key in [("continent", continents, "continent_id"),
                         ("country", countries, "country_id"),
                         ("area", areas, "region_id"),
                         ("city", cities, "city_id")]:
    for d in dups(items, key):
        if key == "region_id" and d in ACCEPTED_DUPLICATE_REGION_IDS:
            accepted.append(d)
        else:
            err(f"duplicate {key}: {d!r}")

# --- referential integrity ---
for c in countries:
    if c.get("continent_id") not in cont_ids:
        err(f"country {c.get('country_id')!r}: continent_id {c.get('continent_id')!r} not in continents")
    if c.get("continent_id2") and c["continent_id2"] not in cont_ids:
        err(f"country {c.get('country_id')!r}: continent_id2 {c['continent_id2']!r} not in continents")
for a in areas:
    if a.get("country_id") not in country_ids:
        err(f"area {a.get('region_id')!r}: country_id {a.get('country_id')!r} not in countries")
    if a.get("continent_id") and a["continent_id"] not in cont_ids:
        err(f"area {a.get('region_id')!r}: continent_id {a['continent_id']!r} not in continents")
for c in cities:
    if c.get("region_id") not in region_ids:
        err(f"city {c.get('city_id')!r}: region_id {c.get('region_id')!r} not in areas")
for v in visits:
    for cid in v.get("city", []):
        if cid not in city_ids:
            err(f"visit {v.get('start_date')!r}: city {cid!r} not in cities")
    for fld in ("start_date", "end_date"):
        if not re.match(r"^\d{2}\.\d{2}\.\d{4}$", str(v.get(fld, ""))):
            warn(f"visit {v.get('start_date')!r}: {fld} {v.get(fld)!r} not DD.MM.YYYY")

# --- completeness ---
for c in cities:
    if not c.get("name_ua"): warn(f"city {c.get('city_id')!r}: missing name_ua")
    if not (c.get("description") or "").strip(): warn(f"city {c.get('city_id')!r}: empty description")
for a in areas:
    if not a.get("name_ua"): warn(f"area {a.get('region_id')!r}: missing name_ua")

# --- assets ---
if os.path.isdir(IMG):
    for c in cities:
        for img in (c.get("image") or "").split(","):
            img = img.strip()
            if img and not os.path.isfile(os.path.join(IMG, img)):
                warn(f"city {c.get('city_id')!r}: image not found IMG/{img}")
    fe = os.path.join(IMG, "flag_n_emblem")
    for c in countries:
        for fld in ("flag_img", "emb_img"):
            f = c.get(fld)
            if f and os.path.isdir(fe) and not os.path.isfile(os.path.join(fe, f)):
                warn(f"country {c.get('country_id')!r}: {fld} not found IMG/flag_n_emblem/{f}")
if os.path.isdir(MAPS):
    for c in countries:
        m = c.get("map_img")
        if m and not os.path.isfile(os.path.join(MAPS, m)):
            warn(f"country {c.get('country_id')!r}: map_img not found SCRIPTS/MAPS/{m}")

# --- onload.json cross-check ---
if os.path.isfile(ONLOAD):
    try:
        onl = json.loads(open(ONLOAD, "rb").read().decode("utf-8"))
        ol_countries = {c.get("country_id") for c in onl.get("country", [])}
        ol_conts = {c.get("continent_id") for c in onl.get("continent", [])}
        for cid in ol_countries:
            if cid not in country_ids:
                warn(f"onload.json: country {cid!r} not in globaldb")
        for cc in ol_conts:
            if cc not in cont_ids:
                warn(f"onload.json: continent {cc!r} not in globaldb")
    except Exception as e:
        err(f"onload.json invalid JSON -> {e}")

# --- report ---
print(f"continents={len(continents)} countries={len(countries)} areas={len(areas)} cities={len(cities)} visits={len(visits)}")
print(f"CRLF lines: {crlf}/{total}")
if accepted:
    print(f"\nACCEPTED EXCEPTIONS ({len(accepted)}) - known intentional duplicates, not errors:")
    for m in accepted: print("  -", f"duplicate region_id: {m!r}")
print(f"\nERRORS ({len(errors)}):")
for m in errors: print("  -", m)
print(f"\nWARNINGS ({len(warns)}):")
for m in warns: print("  -", m)
print("\nRESULT:", "FAIL" if errors else "OK")
sys.exit(1 if errors else 0)
