#!/usr/bin/env python3
"""Extract region (id, English title) pairs from an ammap map JS file.
Usage: python extract_regions.py <path-to-map.js>
Prints a JSON array of [region_id, english_name] pairs, in map order.
Each SVG path in an ammap map carries "id":"XX-YY" and "title":"Name";
the leading // comment lines are ignored.

Region ID format rule:
  Valid ids always have the form CC-XX (e.g. "BG-01", "AD-07").
  Some single-territory island maps use just the country code as the id
  (e.g. "IM" for Isle of Man). These bare ids are auto-fixed to "CC-01"
  so they (a) follow the two-part convention, (b) avoid collisions with
  the same territory appearing as a region on another country's map.
"""
import json, re, sys

if len(sys.argv) < 2:
    print("usage: extract_regions.py <map.js>", file=sys.stderr); sys.exit(2)

text = open(sys.argv[1], encoding="utf-8").read()
# drop comment lines (the header "// areas: {id:...}" uses unquoted keys anyway)
text = "\n".join(l for l in text.split("\n") if not l.lstrip().startswith("//"))

pairs, pend = [], None
for m in re.finditer(r'"(id|title)":"([^"]*)"', text):
    key, val = m.group(1), m.group(2)
    if key == "id":
        pend = val
    elif key == "title" and pend is not None:
        pairs.append([pend, val])
        pend = None

# de-dup keeping order (some maps repeat an id across multi-part shapes)
seen, uniq = set(), []
for rid, title in pairs:
    if rid not in seen:
        seen.add(rid); uniq.append([rid, title])

# Fix bare country-code ids (no hyphen) → CC-01.
# Warn so the caller knows a synthetic id was used.
fixed = []
for rid, title in uniq:
    if "-" not in rid:
        new_rid = rid + "-01"
        print(f"WARNING: bare region_id '{rid}' → '{new_rid}' (single-territory map, synthetic id)", file=sys.stderr)
        fixed.append([new_rid, title])
    else:
        fixed.append([rid, title])

print(json.dumps(fixed, ensure_ascii=False, indent=2))
print(f"# {len(fixed)} regions", file=sys.stderr)