#!/usr/bin/env node
/**
 * gen_stories_index.js — regenerate DATA/stories.json from the story files.
 *
 * Scans DATA/stories/*.json, reads { id, title, route[0].date } from each,
 * and rewrites DATA/stories.json as a sorted index used by the Settings
 * screens (story editor picker + visit form story dropdown).
 *
 * Run it whenever you add, remove, rename or re-title a story:
 *     node tools/gen_stories_index.js
 *
 * No dependencies — plain Node.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var STORIES_DIR = path.join(ROOT, "DATA", "stories");
var INDEX_FILE = path.join(ROOT, "DATA", "stories.json");

function main() {
    if (!fs.existsSync(STORIES_DIR)) {
        console.error("Folder not found: " + STORIES_DIR);
        process.exit(1);
    }

    var files = fs.readdirSync(STORIES_DIR).filter(function (f) {
        return /\.json$/i.test(f);
    });

    var entries = [];
    files.forEach(function (file) {
        var full = path.join(STORIES_DIR, file);
        var story;
        try {
            story = JSON.parse(fs.readFileSync(full, "utf8"));
        } catch (e) {
            console.error("Skipped (invalid JSON): " + file + " — " + e.message);
            return;
        }
        var id = story.id || file.replace(/\.json$/i, "");
        var date = (story.route && story.route[0] && story.route[0].date) ? story.route[0].date : null;
        entries.push({ id: id, title: story.title || "", date: date });
    });

    // Same ordering as the original index: undated stories first, then by date ascending.
    entries.sort(function (a, b) {
        if (!a.date && !b.date) { return 0; }
        if (!a.date) { return -1; }
        if (!b.date) { return 1; }
        return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0);
    });

    fs.writeFileSync(INDEX_FILE, JSON.stringify(entries, null, 2) + "\n", "utf8");
    console.log("Wrote " + entries.length + " stories to " + path.relative(ROOT, INDEX_FILE));
}

main();
