//08. Settings Page
//08.01 Creator of main page
function createSettingsPage_HTML() {
    //Add Settings main content — modern layout: sticky left menu + main blocks area
    document.getElementById("mainSection").innerHTML =
        '<div class="set-page" id="settingsPage">' +
            '<div class="set-layout">' +
                HTML_Settings_LeftPanel() +
                '<main class="set-main" id="rightSettingsSection"></main>' +
            '</div>' +
        '</div>';

    createSettingsOverviewTab_HTML();

    //Highlight the active section in the navbar
    setActiveNav("navSettings");

    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?page=settings"); }
}

//08.02 Creator of left menu
function HTML_Settings_LeftPanel() {
    var result =
        '<aside class="set-sidebar">' +
            '<ul class="set-nav">' +
                '<li class="active" id="overview"><a onclick="javascript:createSettingsOverviewTab_HTML()" onmouseover="" style="cursor: pointer;">' + t('setOverview') + '</a></li>' +
            '</ul>' +
            '<ul class="set-nav">' +
                '<li id="ctypes"><a onclick="javascript:createSettingsCountryTypeTab()" onmouseover="" style="cursor: pointer;">' + t('setCountryTypes') + '</a></li>' +
                '<li id="types"><a onclick="javascript:createSettingsTypeTab()" onmouseover="" style="cursor: pointer;">' + t('setLocationTypes') + '</a></li>' +
                '<li id="continents"><a onclick="javascript:createSettingsContinentTab()" onmouseover="" style="cursor: pointer;">' + t('setContinents') + '</a></li>' +
                '<li id="countries"><a onclick="javascript:createSettingsCountryTab()" onmouseover="" style="cursor: pointer;">' + t('setCountries') + '</a></li>' +
                '<li id="regions"><a onclick="javascript:createSettingsRegionTab()" onmouseover="" style="cursor: pointer;">' + t('setRegions') + '</a></li>' +
                '<li id="cities"><a onclick="javascript:createSettingsCityTab()" onmouseover="" style="cursor: pointer;">' + t('setLocations') + '</a></li>' +
            '</ul>' +
            '<ul class="set-nav">' +
                '<li id="visits"><a onclick="javascript:createSettingsVisitTab()" onmouseover="" style="cursor: pointer;">' + t('setVisits') + '</a></li>' +
                '<li id="stories"><a onclick="javascript:createSettingsStoryTab()" onmouseover="" style="cursor: pointer;">' + t('setStories') + '</a></li>' +
            '</ul>' +
        '</aside>';

    return result;
}

//08.03 Creator of overview section
function createSettingsOverviewTab_HTML() {
    // Set global variable with type of map to be opened
    local = [];
    local.push("settings", "overview");

    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"overview");

    // Set menu marker
    removeAllAttributesByName("class", "active", ".navbar-nav");
    document.getElementById("overview").setAttribute("class", "active")

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";

    // Narrow KPI cards: big total on top, smaller "visited" count below
    function kpi(label, total, sub) {
        return '<div class="set-kpi-card">' +
                   '<div class="set-kpi-lbl">' + label + '</div>' +
                   '<div class="set-kpi-num">' + total + '</div>' +
                   (sub ? '<div class="set-kpi-sub">' + sub + '</div>' : '') +
               '</div>';
    }

    document.getElementById("rightSettingsSection").innerHTML =
        // Top KPI cards
        '<section class="set-block">' +
            '<div class="set-kpi">' +
                kpi(t('kpiCountries'), data.country.length, t('kpiVisited') + " " + countriesVisited.length) +
                kpi(t('kpiRegions'),   data.area.length,    t('kpiVisited') + " " + regionsVisited.length) +
                kpi(t('kpiCities'),    data.city.length,    t('kpiVisited') + " " + citiesVisited.length) +
                kpi(t('kpiVisits'),    visitsSorted.length, "") +
            '</div>' +
        '</section>' +
        // Data transformation — option rows (buttons are non-functional for now)
        '<section class="set-block">' +
            '<h2 class="set-block-title">' + t('setDataOps') + '</h2>' +
            '<div class="set-panel">' +
                '<div class="set-options">' +
                    '<div class="set-option">' +
                        '<div class="set-option-info">' +
                            '<div class="set-option-title">' + t('setExportData') + '</div>' +
                            '<div class="set-option-desc">' + t('setExportDesc') + '</div>' +
                        '</div>' +
                        '<div class="set-option-actions">' +
                            '<button type="button" class="set-btn" onclick="javascript:exportToPdf()">PDF</button>' +
                            '<button type="button" class="set-btn" onclick="javascript:exportToCsv()">CSV</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="set-option-wrap">' +
                        '<div class="set-option">' +
                            '<div class="set-option-info">' +
                                '<div class="set-option-title">' + t('setGenGlobaldb') + '</div>' +
                                '<div class="set-option-desc">' + t('setGenGlobaldbDesc') + '</div>' +
                            '</div>' +
                            '<div class="set-option-actions">' +
                                '<button type="button" class="set-btn set-btn-primary" onclick="javascript:generateGlobalDb()">' + t('setGenerate') + '</button>' +
                            '</div>' +
                        '</div>' +
                        '<span id="globaldbGenMsg"></span>' +
                    '</div>' +
                    '<div class="set-option-wrap">' +
                        '<div class="set-option">' +
                            '<div class="set-option-info">' +
                                '<div class="set-option-title">' + t('setGenOnload') + '</div>' +
                                '<div class="set-option-desc">' + t('setGenOnloadDesc') + '</div>' +
                            '</div>' +
                            '<div class="set-option-actions">' +
                                '<button type="button" class="set-btn set-btn-primary" onclick="javascript:generateOnloadJson()">' + t('setGenerate') + '</button>' +
                            '</div>' +
                        '</div>' +
                        '<span id="onloadGenMsg"></span>' +
                    '</div>' +
                    '<div class="set-option-wrap">' +
                        '<div class="set-option">' +
                            '<div class="set-option-info">' +
                                '<div class="set-option-title">' + t('setGenStories') + '</div>' +
                                '<div class="set-option-desc">' + t('setGenStoriesDesc') + '</div>' +
                            '</div>' +
                            '<div class="set-option-actions">' +
                                '<button type="button" class="set-btn set-btn-primary" onclick="javascript:generateStoriesIndex()">' + t('setGenerate') + '</button>' +
                            '</div>' +
                        '</div>' +
                        '<span id="storiesGenMsg"></span>' +
                    '</div>' +
                    '<div class="set-option-wrap">' +
                        '<div class="set-option">' +
                            '<div class="set-option-info">' +
                                '<div class="set-option-title">' + t('setValidate') + '</div>' +
                                '<div class="set-option-desc">' + t('setValidateDesc') + '</div>' +
                            '</div>' +
                            '<div class="set-option-actions">' +
                                '<span class="set-info-wrap">' +
                                    '<button type="button" class="set-info-btn" aria-label="info">&#x2139;</button>' +
                                    '<span class="set-info-tip">' + t('setValidateHelp') + '</span>' +
                                '</span>' +
                                '<button type="button" class="set-btn set-btn-primary" onclick="javascript:validateTravelDb()">' + t('setCheck') + '</button>' +
                            '</div>' +
                        '</div>' +
                        '<span id="validateMsg"></span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</section>' +
        // Countries table
        '<section class="set-block">' +
            '<div class="set-block-head">' +
                '<h2 class="set-block-title">' + t('setCountries') + '</h2>' +
                '<label class="set-check"><input type="checkbox" onchange="javascript:toggleOnlyMissing(this.checked)"> ' + t('setOnlyUnvisited') + '</label>' +
            '</div>' +
            HTML_VisitesPerCountryTale() +
        '</section>';
}

function HTML_VisitesPerCountryTale() {
    // --- precompute totals & capitals from the raw base ---
    var regCountry = {};                                   // region_id -> country_id
    $.each(data.area, function( i, a ){ regCountry[a.region_id] = a.country_id; });

    var totRegions = {}, totCities = {}, capitalOf = {};   // per country_id
    $.each(data.area, function( i, a ){ totRegions[a.country_id] = (totRegions[a.country_id] || 0) + 1; });
    $.each(data.city, function( i, c ){
        var cid = regCountry[c.region_id];
        if (!cid) { return; }
        totCities[cid] = (totCities[cid] || 0) + 1;
        if (c.capital === "true") { capitalOf[cid] = c.city_id; }
    });

    var visitedCity = {};                                  // visited city_id -> true
    $.each(citiesVisited, function( i, cv ){ visitedCity[cv.city_id] = true; });

    var frac = function (v, t) { return '<b>' + v + '</b> <span class="set-frac">/ ' + t + '</span>'; };

    // build one country row (marked c-visited / c-missing for the filter)
    function rowFor(country) {
        var cid = country.country_id;
        var countryObj = $.grep (countriesVisited, function( n, i ){ return (n.country_id == cid); });
        var visited = (countryObj[0] != undefined);

        var numberCountryVisites = 0;
        if (visited) {
            $.each(visitsSorted, function( i, visit ){
                var ifVisited = false;
                $.each(visit.cities, function( i, city ){
                    if (city.country_id == countryObj[0].short_name) {ifVisited = true;}
                });
                if (ifVisited) {numberCountryVisites = numberCountryVisites + 1;}
            });
        }

        var regV  = visited ? countryObj[0].getNumberOfVisitedRegions() : 0;
        var cityV = visited ? countryObj[0].getNumberOfVisitedCities()  : 0;

        // ✓ only when the capital is in the base AND visited; otherwise — (not visited or not in base)
        var capVisited = (capitalOf[cid] !== undefined && visitedCity[capitalOf[cid]]);
        var capCell = capVisited
            ? '<span class="cap-yes" title="' + t('setCapVisited') + '">✓</span>'
            : '<span class="set-miss" title="' + t('setCapNotVisited') + '">—</span>';

        var nameCell = visited
            ? "<a id='" + country.short_name + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + entityName(country) + "</a>"
            : "<a id='" + country.short_name + "' onclick='javascript:previewCountryPage(this.id)' onmouseover='' style='cursor: pointer; color: var(--muted);'>" + entityName(country) + "</a> <span class='set-miss' title='" + t('setNotVisited') + "'>✕</span>";

        var rowClass = (numberCountryVisites === 0) ? "c-missing" : "c-visited";

        return '<tr class="' + rowClass + '">' +
            '<td>' + nameCell + '</td>' +
            '<td class="num">' + capCell + '</td>' +
            '<td class="num">' + frac(regV,  totRegions[cid] || 0) + '</td>' +
            '<td class="num">' + frac(cityV, totCities[cid]  || 0) + '</td>' +
            '<td class="num">' + numberCountryVisites + '</td>' +
        '</tr>';
    }

    // group countries by continent (every continent gets a section, even if empty)
    data.country.sort(dynamicSort(window.LANG === 'en' ? 'name' : 'name_ua'));
    var byCont = {};
    $.each(data.country, function( i, c ){ (byCont[c.continent_id] = byCont[c.continent_id] || []).push(c); });

    // continent header row also carries the column labels (repeated per continent)
    var body = "";
    $.each(data.continent, function( i, cont ){
        body += '<tr class="grp">' +
                    '<td class="grp-name">' + entityName(cont) + '</td>' +
                    '<td class="num">' + t('setColCapital') + '</td>' +
                    '<td class="num">' + t('setRegions') + '</td>' +
                    '<td class="num">' + t('setColCities') + '</td>' +
                    '<td class="num">' + t('setColVisits') + '</td>' +
                '</tr>';
        $.each(byCont[cont.continent_id] || [], function( j, country ){ body += rowFor(country); });
    });

    return  '<div class="set-table-wrap" id="countriesTable">' +
                '<table class="set-table">' +
                    '<tbody>' +
                        body +
                    '</tbody>' +
                '</table>' +
            '</div>';
}

// Toggle "show only countries with 0 visits" on the countries table
function toggleOnlyMissing(on) {
    var el = document.getElementById("countriesTable");
    if (el) { el.classList.toggle("only-missing", on); }
}

// Open a preview country page for a country with no real visits.
// Injects a temporary fake visit (today, all DB cities) so the country page
// renders with map + city list + "My Visits" panel. Arrays are restored only
// when the user navigates away from this country/its cities context.
function previewCountryPage(shortName) {
    // Clean up any still-active previous preview
    if (window._previewRestore) {
        window._previewRestore();
        window._previewRestore = null;
    }
    if (window._previewObserver) {
        window._previewObserver.disconnect();
        window._previewObserver = null;
    }

    var countryData = null;
    $.each(data.country, function(i, c) {
        if (c.short_name === shortName) { countryData = c; return false; }
    });
    if (!countryData) { return; }

    // Collect IDs of all cities that belong to active regions of this country
    var regionIds = {};
    $.each(data.area, function(i, a) {
        if (a.country_id === countryData.country_id && a.active !== 'N') {
            regionIds[a.region_id] = true;
        }
    });
    var cityIds = [];
    $.each(data.city, function(i, c) {
        if (regionIds[c.region_id]) { cityIds.push(c.city_id); }
    });

    // Build today string DD.MM.YYYY
    var now = new Date();
    var dd = now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate();
    var mm = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : '' + (now.getMonth() + 1);
    var todayStr = dd + '.' + mm + '.' + now.getFullYear();

    // Snapshot originals
    var origVisits    = visitsSorted.slice();
    var origCities    = citiesVisited.slice();
    var origRegions   = regionsVisited.slice();
    var origCountries = countriesVisited.slice();

    // Inject fake cities and visit
    var fakeCities = [];
    var injected = {};
    $.each(cityIds, function(i, cityId) {
        fakeCities.push({ city_id: cityId, country_id: shortName });
        if (!injected[cityId]) {
            citiesVisited.push(new CityObj(cityId));
            injected[cityId] = true;
        }
    });
    visitsSorted.unshift(new VisitObj(todayStr, todayStr, fakeCities, null, false, undefined, null));

    // Rebuild regions + countries from updated citiesVisited
    createArrayOfVisitedCountriesAndRegions();

    // If no cities in DB for this country, push CountryObj directly so page can render
    var inList = $.grep(countriesVisited, function(n) { return n.short_name === shortName; });
    if (!inList.length) { countriesVisited.push(new CountryObj(countryData.country_id)); }

    window._previewRestore = function() {
        visitsSorted    = origVisits;
        citiesVisited   = origCities;
        regionsVisited  = origRegions;
        countriesVisited = origCountries;
    };

    $.getScript("SCRIPTS/trv_country.js?v=" + APP_V, function() {
        createCountryPage_HTML(shortName);

        // After initial render, watch for navigation AWAY from this preview context.
        // Keep arrays alive while user stays on this country or its cities.
        var mainSection = document.getElementById('mainSection');
        if (mainSection) {
            window._previewObserver = new MutationObserver(function() {
                var stillInContext = local && local[1] && (
                    (local[1].type === 'country' && local[1].short_name === shortName) ||
                    (local[1].type === 'city' && local[1].getCountryId && local[1].getCountryId() === shortName)
                );
                if (stillInContext) { return; }
                if (window._previewRestore) {
                    window._previewRestore();
                    window._previewRestore = null;
                }
                window._previewObserver.disconnect();
                window._previewObserver = null;
            });
            window._previewObserver.observe(mainSection, { childList: true });
        }
    }).fail(function() {
        if (window._previewRestore) { window._previewRestore(); window._previewRestore = null; }
        document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>';
    });
}

//08.04 Regenerate DATA/stories.json in the browser and offer it for download.
// Mirrors tools/gen_stories_index.js, but limited to stories the browser can
// "see": those already in stories.json plus any referenced by a visit. Brand-new
// files not yet listed/linked are invisible here — use the Node script for those.
function generateStoriesIndex() {
    var msg = function (cls, html) {
        var el = document.getElementById("storiesGenMsg");
        if (el) { el.className = "set-alert " + cls; el.innerHTML = html; }
    };
    msg("", t('setMsgCollecting'));

    $.getJSON("DATA/stories.json", function (index) {
        var ids = {};
        $.each(index || [], function (i, s) { if (s && s.id) { ids[s.id] = true; } });
        $.each(visitsSorted, function (i, v) { var sid = getStoryRefId(v); if (sid) { ids[sid] = true; } });

        var list = Object.keys(ids);
        var entries = [];
        var pending = list.length;

        var finish = function () {
            entries.sort(function (a, b) {
                if (!a.date && !b.date) { return 0; }
                if (!a.date) { return -1; }
                if (!b.date) { return 1; }
                return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0);
            });

            var json = JSON.stringify(entries, null, 2) + "\n";
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
            a.download = "stories.json";
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(a.href);

            window.__storiesIndex = entries;   // refresh the cached catalog
            msg("is-ok", t('setOkGenerated') + " <b>" + entries.length + "</b> " +
                (window.LANG === 'en' ? (entries.length === 1 ? 'story' : 'stories') : 'історій') + ". " +
                t('setOkSaveAs') + " <b>DATA/stories.json</b>.<br>" + t('setOkStoriesNote'));
        };

        if (pending === 0) { finish(); return; }

        list.forEach(function (id) {
            $.getJSON("DATA/stories/" + id + ".json")
                .done(function (story) {
                    var date = (story.route && story.route[0] && story.route[0].date) ? story.route[0].date : null;
                    entries.push({ id: story.id || id, language: story.language || "UA", title: story.title || "", date: date });
                })
                .always(function () { if (--pending === 0) { finish(); } });   // skip missing/deleted files
        });
    }).fail(function () {
        msg("is-err", t('setMsgFailStories'));
    });
}

//08.05 Regenerate DATA/onload.json in the browser and offer it for download.
// Scans visits → cities → regions → countries to find which countries were visited,
// then emits continent[] and country[] sorted alphabetically by Ukrainian name.
// Compares with the existing onload.json and reports added/removed countries.
function generateOnloadJson() {
    var msg = function (cls, html) {
        var el = document.getElementById("onloadGenMsg");
        if (el) { el.className = "set-alert " + cls; el.innerHTML = html; }
    };
    msg("", t('setMsgCollecting'));

    $.getJSON("DATA/onload.json").always(function (existingOrXhr) {
        var existing = (existingOrXhr && existingOrXhr.country) ? existingOrXhr : { continent: [], country: [] };

        // city_id → region_id
        var cityRegion = {};
        $.each(data.city, function (i, c) { cityRegion[c.city_id] = c.region_id; });

        // region_id → country_id
        var regionCountry = {};
        $.each(data.area, function (i, a) { regionCountry[a.region_id] = a.country_id; });

        // collect visited country_ids from all visits
        var visitedCountryIds = {};
        $.each(data.visit, function (i, v) {
            $.each(v.city || [], function (j, cityId) {
                var regionId = cityRegion[cityId];
                if (regionId) {
                    var countryId = regionCountry[regionId];
                    if (countryId) { visitedCountryIds[countryId] = true; }
                }
            });
        });

        // country_id → name_ua for sorting
        var countryNameUa = {};
        $.each(data.country, function (i, c) { countryNameUa[c.country_id] = c.name_ua || ""; });

        // build visited countries array with onload fields
        var visitedCountries = [];
        $.each(data.country, function (i, c) {
            if (!visitedCountryIds[c.country_id]) { return; }
            var nameFull = (c.name_nt && c.name_nt.trim())
                ? c.name_ua + " - " + c.name_nt + " - " + c.name
                : c.name_ua + " - " + c.name;
            var entry = { country_id: c.country_id, continent_id: c.continent_id };
            if (c.continent_id2) { entry.continent_id2 = c.continent_id2; }
            entry.short_name     = c.short_name;
            entry.small_flag_img = c.small_flag_img;
            entry.name_full      = nameFull;
            visitedCountries.push(entry);
        });

        visitedCountries.sort(function (a, b) {
            return (countryNameUa[a.country_id] || "").localeCompare(countryNameUa[b.country_id] || "", "uk");
        });

        // collect visited continent_ids (continent_id2 counts too, e.g. Spain → AF)
        var visitedContIds = {};
        $.each(visitedCountries, function (i, c) {
            visitedContIds[c.continent_id] = true;
            if (c.continent_id2) { visitedContIds[c.continent_id2] = true; }
        });

        // build and sort continents list
        var visitedContinents = [];
        $.each(data.continent, function (i, cont) {
            if (visitedContIds[cont.continent_id]) {
                visitedContinents.push({ continent_id: cont.continent_id, name_ua: cont.name_ua, name: cont.name });
            }
        });
        visitedContinents.sort(function (a, b) {
            return (a.name_ua || "").localeCompare(b.name_ua || "", "uk");
        });

        // diff: compare new vs existing country and continent lists
        var oldCountryIds = {};
        $.each(existing.country, function (i, c) { oldCountryIds[c.country_id] = true; });
        var oldContIds = {};
        $.each(existing.continent, function (i, c) { oldContIds[c.continent_id] = true; });

        var addedCountries = [], removedCountries = [];
        $.each(visitedCountries, function (i, c) {
            if (!oldCountryIds[c.country_id]) { addedCountries.push(countryNameUa[c.country_id] || c.country_id); }
        });
        $.each(existing.country, function (i, c) {
            if (!visitedCountryIds[c.country_id]) { removedCountries.push(countryNameUa[c.country_id] || c.country_id); }
        });

        var addedConts = [], removedConts = [];
        var contNameUa = {};
        $.each(data.continent, function (i, c) { contNameUa[c.continent_id] = c.name_ua; });
        $.each(visitedContinents, function (i, c) {
            if (!oldContIds[c.continent_id]) { addedConts.push(c.name_ua); }
        });
        $.each(existing.continent, function (i, c) {
            if (!visitedContIds[c.continent_id]) { removedConts.push(contNameUa[c.continent_id] || c.continent_id); }
        });

        var onload = { continent: visitedContinents, country: visitedCountries };
        var json = JSON.stringify(onload, null, 2) + "\n";
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
        a.download = "onload.json";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

        // build diff summary
        var diffLines = [];
        if (addedCountries.length) {
            var cWordA = window.LANG === 'en'
                ? (addedCountries.length === 1 ? 'country' : 'countries')
                : 'кра' + (addedCountries.length === 1 ? 'їна' : (addedCountries.length < 5 ? 'їни' : 'їн'));
            diffLines.push('➕ ' + t('setDiffAdded') + ' ' + addedCountries.length + ' ' + cWordA + ': <b>' + addedCountries.join(', ') + '</b>');
        }
        if (removedCountries.length) {
            var cWordR = window.LANG === 'en'
                ? (removedCountries.length === 1 ? 'country' : 'countries')
                : 'кра' + (removedCountries.length === 1 ? 'їну' : (removedCountries.length < 5 ? 'їни' : 'їн'));
            diffLines.push('➖ ' + t('setDiffRemoved') + ' ' + removedCountries.length + ' ' + cWordR + ': <b>' + removedCountries.join(', ') + '</b>');
        }
        if (addedConts.length) {
            diffLines.push('➕ ' + t('setDiffNewCont') + ': <b>' + addedConts.join(', ') + '</b>');
        }
        if (removedConts.length) {
            diffLines.push('➖ ' + t('setDiffGoneCont') + ': <b>' + removedConts.join(', ') + '</b>');
        }
        if (!diffLines.length) {
            diffLines.push(t('setDiffNoChanges'));
        }

        var onloadCWord  = window.LANG === 'en' ? (visitedCountries.length  === 1 ? 'country'   : 'countries')  : 'країн';
        var onloadCtWord = window.LANG === 'en' ? (visitedContinents.length === 1 ? 'continent' : 'continents') : 'континентах';
        var onloadIn     = window.LANG === 'en' ? 'in' : 'у';
        msg("is-ok",
            t('setOkGenerated') + " <b>" + visitedCountries.length + "</b> " + onloadCWord + " " +
            onloadIn + " <b>" + visitedContinents.length + "</b> " + onloadCtWord + ". " +
            t('setOkSaveAs') + " <b>DATA/onload.json</b>.<br>" +
            diffLines.join("<br>"));
    });
}

//08.06 Validate DATA/globaldb.json — JSON syntax first, then referential integrity.
// Fetches the raw file text so JSON.parse errors yield exact line/column info.
function validateTravelDb() {
    var el = document.getElementById("validateMsg");
    if (el) { el.className = "set-alert"; el.innerHTML = t('setMsgLoading'); }

    function esc(s) {
        return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }

    $.ajax({ url: "DATA/globaldb.json", dataType: "text", cache: false })
        .fail(function () {
            if (el) { el.className = "set-alert is-err"; el.innerHTML = t('setMsgFailLoad'); }
        })
        .done(function (rawText) {

            // ── 1. JSON syntax check ─────────────────────────────────────────
            var db;
            try { db = JSON.parse(rawText); } catch (e) {
                var ctxHtml = "";
                // Chrome/Edge: "... at position N"  |  Firefox: "... at line L column C ..."
                var mPos = e.message.match(/position\s+(\d+)/i);
                var mLC  = e.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);

                function lineContext(lineNum, col0) {   // col0 is 0-indexed
                    var lines = rawText.split("\n");
                    var line  = lines[lineNum - 1] || "";
                    var start = Math.max(0, col0 - 40);
                    var snip  = line.substring(start, start + 82);
                    var caret = new Array(Math.min(col0 - start, 81) + 1).join(" ") + "^";
                    return '<code class="val-json-ctx">' + esc(snip) + '</code>' +
                           '<code class="val-json-caret">' + caret + '</code>' +
                           '<small>' + t('setValLine') + ' <b>' + lineNum + '</b>, ' + t('setValCol') + ' <b>' + (col0 + 1) + '</b></small>';
                }

                if (mPos) {
                    var pos    = parseInt(mPos[1], 10);
                    var before = rawText.substring(0, pos);
                    var ln     = (before.match(/\n/g) || []).length + 1;
                    var col    = pos - before.lastIndexOf("\n") - 1;
                    ctxHtml    = lineContext(ln, col);
                } else if (mLC) {
                    ctxHtml = lineContext(parseInt(mLC[1], 10), parseInt(mLC[2], 10) - 1);
                }

                if (el) {
                    el.className  = "set-alert is-err";
                    el.innerHTML  = '<div class="val-report"><div class="val-block val-errors">' +
                        '<strong>' + t('setValSyntaxErr') + '</strong><br>' +
                        esc(e.message) + '<br>' + ctxHtml + '</div></div>';
                }
                return;
            }

            // ── 2. Structural / referential checks ───────────────────────────
            var errors = [], warnings = [];
            function err(m, h)  { errors.push({ msg: m, hint: h || "" }); }
            function warn(m, h) { warnings.push({ msg: m, hint: h || "" }); }

            var isEn = window.LANG === 'en';
            var contIds = {}, countryIds = {}, regionIds = {}, cityIds = {};
            $.each(db.continent || [], function (i, c) { contIds[c.continent_id] = true; });

            $.each(db.country || [], function (i, c) {
                if (!c.country_id) { err((isEn ? 'Country #' : 'Країна #') + i + (isEn ? ' has no country_id' : ' не має country_id'), c.name || c.name_ua || '#' + i); return; }
                if (countryIds[c.country_id]) { err((isEn ? 'Duplicate country_id: «' : 'Дублікат country_id: «') + c.country_id + '»', '"country_id": "' + c.country_id + '"'); }
                countryIds[c.country_id] = true;
                if (!contIds[c.continent_id]) {
                    err((isEn ? 'Country «' : 'Країна «') + (c.name_ua || c.country_id) + (isEn ? '» → unknown continent «' : '» → невідомий континент «') + c.continent_id + '»',
                        '"country_id": "' + c.country_id + '"');
                }
                if (!c.name_ua) { warn((isEn ? 'Empty name_ua for country' : 'Порожній name_ua у країни'), '"country_id": "' + c.country_id + '"'); }
            });

            $.each(db.area || [], function (i, a) {
                if (!a.region_id) { err((isEn ? 'Region #' : 'Регіон #') + i + (isEn ? ' has no region_id' : ' не має region_id'), a.name || '#' + i); return; }
                if (regionIds[a.region_id]) { err((isEn ? 'Duplicate region_id: «' : 'Дублікат region_id: «') + a.region_id + '»', '"region_id": "' + a.region_id + '"'); }
                regionIds[a.region_id] = true;
                if (!countryIds[a.country_id]) {
                    err((isEn ? 'Region «' : 'Регіон «') + a.region_id + (isEn ? '» → unknown country «' : '» → невідома країна «') + a.country_id + '»',
                        '"region_id": "' + a.region_id + '"');
                }
                if (!a.name_ua) { warn((isEn ? 'Empty name_ua for region' : 'Порожній name_ua у регіону'), '"region_id": "' + a.region_id + '"'); }
            });

            var emptyCityDesc = [], emptyCityNameUa = [];
            $.each(db.city || [], function (i, c) {
                if (!c.city_id) { err((isEn ? 'City #' : 'Місто #') + i + ' (' + (c.name || '?') + ') ' + (isEn ? 'has no city_id' : 'не має city_id'), '"name": "' + (c.name || '') + '"'); return; }
                if (cityIds[c.city_id]) { err((isEn ? 'Duplicate city_id: «' : 'Дублікат city_id: «') + c.city_id + '»', '"city_id": "' + c.city_id + '"'); }
                cityIds[c.city_id] = true;
                if (!c.region_id) {
                    err((isEn ? 'City «' : 'Місто «') + c.city_id + (isEn ? '» has no region_id' : '» не має region_id'), '"city_id": "' + c.city_id + '"');
                } else if (!regionIds[c.region_id]) {
                    err((isEn ? 'City «' : 'Місто «') + c.city_id + (isEn ? '» → unknown region «' : '» → невідомий регіон «') + c.region_id + '»',
                        '"city_id": "' + c.city_id + '"');
                }
                if (!c.name_ua)    { emptyCityNameUa.push(c.city_id); }
                if (!c.description){ emptyCityDesc.push(c.city_id); }
            });

            if (emptyCityNameUa.length) {
                warn((isEn ? 'Empty name_ua in ' : 'Порожній name_ua у ') + emptyCityNameUa.length + (isEn ? ' cities' : ' міст'),
                    emptyCityNameUa.slice(0, 10).map(function (id) { return '"' + id + '"'; }).join(", ") +
                    (emptyCityNameUa.length > 10 ? ", ..." : ""));
            }
            if (emptyCityDesc.length) {
                warn((isEn ? 'Empty description in ' : 'Порожній опис у ') + emptyCityDesc.length + (isEn ? ' cities' : ' міст'),
                    emptyCityDesc.slice(0, 10).map(function (id) { return '"city_id": "' + id + '"'; }).join(", ") +
                    (emptyCityDesc.length > 10 ? ", ..." : ""));
            }

            $.each(db.visit || [], function (i, v) {
                if (!v.city || !v.city.length) {
                    warn((isEn ? 'Visit from ' : 'Візит від ') + (v.start_date || '?') + (isEn ? ' has no cities' : ' не має міст'),
                        '"start_date": "' + (v.start_date || '') + '"');
                    return;
                }
                $.each(v.city, function (j, cityId) {
                    if (!cityIds[cityId]) {
                        err((isEn ? 'Visit from ' : 'Візит від ') + (v.start_date || '?') + (isEn ? ' → unknown city «' : ' → невідоме місто «') + cityId + '»',
                            '"start_date": "' + (v.start_date || '') + '"');
                    }
                });
            });

            // ── 3. Render ─────────────────────────────────────────────────────
            function renderItem(item) {
                return '<li>' + esc(item.msg) +
                    (item.hint ? ' <code class="val-hint">' + esc(item.hint) + '</code>' : '') + '</li>';
            }

            var html = '<div class="val-report">' +
                '<div class="val-summary">' + t('setValChecked') + ' ' +
                '<b>' + (db.continent||[]).length + '</b> ' + t('setValContinents')    + ', ' +
                '<b>' + (db.country||[]).length   + '</b> ' + t('setValCountriesWord') + ', ' +
                '<b>' + (db.area||[]).length       + '</b> ' + t('setValRegionsWord')   + ', ' +
                '<b>' + (db.city||[]).length       + '</b> ' + t('setValCitiesWord')    + ', ' +
                '<b>' + (db.visit||[]).length      + '</b> ' + t('setValVisitsWord')    + '.</div>';

            if (errors.length) {
                html += '<div class="val-block val-errors"><strong>' + t('setValErrors') + ' (' + errors.length + '):</strong>' +
                    '<ul>' + errors.map(renderItem).join("") + '</ul></div>';
            }
            if (warnings.length) {
                html += '<div class="val-block val-warnings"><strong>' + t('setValWarnings') + ' (' + warnings.length + '):</strong>' +
                    '<ul>' + warnings.map(renderItem).join("") + '</ul></div>';
            }
            if (!errors.length && !warnings.length) {
                html += '<div class="val-block val-ok">' + t('setValOk') + '</div>';
            } else if (!errors.length) {
                html += '<div class="val-block val-ok">' + t('setValOkWarn') + '</div>';
            }
            html += '</div>';

            if (el) {
                el.className = errors.length ? "set-alert is-err" : (warnings.length ? "set-alert is-warn" : "set-alert is-ok");
                el.innerHTML = html;
            }
        });
}

//08.07 Export to PDF: opens a styled print-preview window with all travel data
function exportToPdf() {
    // ── lookup maps ────────────────────────────────────────────────────────────
    var cityById = {}, areaById = {}, countryBySN = {}, continentById = {};
    $.each(data.city,      function(i, c) { if (c.city_id)      { cityById[c.city_id]          = c; } });
    $.each(data.area,      function(i, a) { if (a.region_id)    { areaById[a.region_id]         = a; } });
    $.each(data.country,   function(i, c) { if (c.short_name)   { countryBySN[c.short_name]     = c; } });
    $.each(data.continent, function(i, c) { if (c.continent_id) { continentById[c.continent_id] = c; } });

    // ── helpers ────────────────────────────────────────────────────────────────
    function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function fmtDate(start, end) {
        var sm = start.getMonth() + 1, sd = start.getDate(), sy = start.getFullYear();
        var em = end.getMonth()   + 1, ed = end.getDate(),   ey = end.getFullYear();
        if (sy === ey) {
            if (sm === em && sd === ed) { return sd + ' ' + getMonthName(sm) + ' ' + sy; }
            if (sm === em)             { return sd + '—' + ed + ' ' + getMonthName(sm) + ' ' + sy; }
            return sd + ' ' + getMonthName(sm) + ' — ' + ed + ' ' + getMonthName(em) + ' ' + sy;
        }
        return sd + ' ' + getMonthName(sm) + ' ' + sy + ' — ' + ed + ' ' + getMonthName(em) + ' ' + ey;
    }

    function durDays(start, end) { return Math.round((end - start) / 86400000) + 1; }

    function dayWord(n) {
        var r = parseFloat(n);
        if (!isFinite(r) || r <= 0) { return ''; }
        var ri = Math.round(r);
        if (ri === 0) { ri = 1; }
        var display = (r === Math.round(r)) ? ri : r;
        if (window.LANG === 'en') { return display + (ri === 1 ? ' day' : ' days'); }
        var last = ri % 10, lastTwo = ri % 100;
        var suffix;
        if (lastTwo >= 11 && lastTwo <= 14)       { suffix = ' днів'; }
        else if (last === 1)                       { suffix = ' день'; }
        else if (last >= 2 && last <= 4)           { suffix = ' дні'; }
        else                                       { suffix = ' днів'; }
        return display + suffix;
    }

    // ── group visits by year (ascending) ───────────────────────────────────────
    var byYear = {}, years = [];
    var ascending = visitsSorted.slice().reverse();
    $.each(ascending, function(i, v) {
        var yr = String(v.start_date.getFullYear());
        if (!byYear[yr]) { byYear[yr] = []; years.push(yr); }
        byYear[yr].push(v);
    });
    years.sort();

    // ── build one visit card ───────────────────────────────────────────────────
    function buildCard(v) {
        var dur     = durDays(v.start_date, v.end_date);
        var durStr  = dayWord(dur);
        var dateStr = fmtDate(v.start_date, v.end_date);

        var cityRows = '';
        $.each(v.cities || [], function(j, c) {
            var cityObj    = cityById[c.city_id]      || {};
            var countryObj = countryBySN[c.country_id]|| {};
            var areaObj    = cityObj.region_id ? (areaById[cityObj.region_id] || {}) : {};
            var cityName   = esc(entityName(cityObj)    || c.city_id);
            var countryName= esc(entityName(countryObj) || c.country_id);
            var areaName   = esc(entityName(areaObj)    || '');
            var where      = (areaName && areaName !== countryName) ? areaName + ', ' + countryName : countryName;
            var daysStr    = (v.days && v.days[c.city_id]) ? dayWord(v.days[c.city_id]) : '';
            cityRows += '<li><span class="vc-cn">' + cityName + '</span>' +
                '<span class="vc-wh">' + where + '</span>' +
                (daysStr ? '<span class="vc-dy">' + daysStr + '</span>' : '') + '</li>';
        });

        var links = '';
        if (v.photos)                              { links += '<a class="vl" href="' + esc(v.photos) + '" target="_blank">&#128248; ' + esc(t('pdfPhotos')) + '</a>'; }
        if (v.story_url)                           { links += '<a class="vl" href="' + esc(v.story_url) + '" target="_blank">&#128214; ' + esc(t('pdfReport')) + '</a>'; }
        else if (v.story && v.story !== true)      { links += '<span class="vl vl-i">&#128214; ' + esc(v.story) + '</span>'; }
        else if (v.story === true)                 { links += '<span class="vl vl-i">&#128214; ' + esc(t('pdfHasReport')) + '</span>'; }

        return '<div class="vc"><div class="vc-hd"><span class="vc-dt">' + dateStr + '</span>' +
            '<span class="vc-dr">' + durStr + '</span></div>' +
            '<div class="vc-bd"><ul class="vc-ls">' + cityRows + '</ul>' +
            (links ? '<div class="vc-lk">' + links + '</div>' : '') + '</div></div>';
    }

    // ── visits section ─────────────────────────────────────────────────────────
    var visitSec = '';
    $.each(years, function(i, yr) {
        var vArr   = byYear[yr];
        var cntStr = window.LANG === 'en' ? (vArr.length === 1 ? 'trip' : 'trips') : parseWord('поїздк', 'а', 'и', 'ок', vArr.length);
        visitSec  += '<div class="yg"><div class="yh">' + yr +
            '<span class="yh-c">' + vArr.length + ' ' + cntStr + '</span></div>';
        $.each(vArr, function(j, v) { visitSec += buildCard(v); });
        visitSec += '</div>';
    });

    // ── countries by continent ─────────────────────────────────────────────────
    var contMap = {}, contOrder = [];
    $.each(countriesVisited, function(i, c) {
        var cid = c.continent_id;
        if (!contMap[cid]) { contMap[cid] = []; contOrder.push(cid); }
        contMap[cid].push(c);
    });
    contOrder.sort();

    var countrySec = '';
    $.each(contOrder, function(i, cid) {
        var contObj  = continentById[cid] || {};
        var contName = esc(entityName(contObj) || cid);
        var clist    = contMap[cid].slice().sort(function(a, b) {
            return (entityName(a) || '').localeCompare(entityName(b) || '', window.LANG === 'en' ? 'en' : 'uk');
        });
        var liHtml = '';
        $.each(clist, function(j, c) { liHtml += '<li>' + esc(entityName(c)) + '</li>'; });
        countrySec += '<div class="cg"><div class="cg-nm">' + contName + ' (' + clist.length + ')</div>' +
            '<ul class="cg-ls">' + liHtml + '</ul></div>';
    });

    // ── cover stats ────────────────────────────────────────────────────────────
    var totalDays = 0;
    $.each(visitsSorted, function(i, v) { totalDays += durDays(v.start_date, v.end_date); });
    var yearRange = years.length > 1 ? years[0] + '–' + years[years.length - 1] : (years[0] || '');
    var now = new Date();
    var genDate = now.getDate() + ' ' + getMonthName(now.getMonth() + 1) + ' ' + now.getFullYear();

    // ── CSS ────────────────────────────────────────────────────────────────────
    var css = [
        '@page{size:A4;margin:15mm 18mm}',
        '*{box-sizing:border-box;margin:0;padding:0}',
        'body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.5}',
        'a{color:#1d4ed8;text-decoration:none}',
        '.cv{min-height:97vh;display:flex;flex-direction:column;justify-content:center;padding:20mm 0;page-break-after:always}',
        '.cv-ti{font-size:28pt;font-weight:700;margin-bottom:6px}',
        '.cv-su{font-size:13pt;color:#555;margin-bottom:28px}',
        '.cv-st{display:flex;gap:28px;margin-bottom:28px;flex-wrap:wrap}',
        '.cv-s{min-width:72px}',
        '.cv-sn{font-size:22pt;font-weight:700;color:#1d4ed8;display:block}',
        '.cv-sl{font-size:8pt;color:#777;text-transform:uppercase;letter-spacing:.5px}',
        '.cv-yr{font-size:14pt;font-weight:600;color:#555;margin-top:8px}',
        '.cv-gd{font-size:9pt;color:#aaa;margin-top:6px}',
        '.sec{margin-top:10px}',
        '.sb{page-break-before:always}',
        '.sh{font-size:16pt;font-weight:700;border-bottom:2.5px solid #1d4ed8;padding-bottom:5px;margin-bottom:16px;page-break-after:avoid}',
        '.yg{margin-bottom:18px}',
        '.yh{font-size:14pt;font-weight:700;color:#1d4ed8;margin:18px 0 9px;page-break-after:avoid;display:flex;align-items:baseline;gap:8px}',
        '.yh-c{font-size:9pt;color:#888;font-weight:400}',
        '.vc{border:1px solid #dde1ea;border-radius:5px;margin-bottom:7px;page-break-inside:avoid;overflow:hidden}',
        '.vc-hd{background:#f0f4ff;padding:6px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dde1ea}',
        '.vc-dt{font-weight:700;font-size:11pt}',
        '.vc-dr{font-size:9.5pt;color:#555;white-space:nowrap}',
        '.vc-bd{padding:7px 12px}',
        '.vc-ls{list-style:none}',
        '.vc-ls li{display:flex;align-items:baseline;padding:2px 0;font-size:10.5pt;gap:6px}',
        '.vc-cn{font-weight:600;min-width:130px}',
        '.vc-wh{color:#444;flex:1}',
        '.vc-dy{color:#888;font-size:9.5pt;white-space:nowrap}',
        '.vc-lk{margin-top:5px;display:flex;gap:10px;font-size:9pt}',
        '.vl{color:#1d4ed8} .vl-i{color:#666}',
        '.cg{margin-bottom:16px;page-break-inside:avoid}',
        '.cg-nm{font-size:11pt;font-weight:700;color:#333;margin-bottom:6px}',
        '.cg-ls{list-style:disc;columns:3;column-gap:14px;font-size:10pt}',
        '.cg-ls li{margin-left:14px;padding:1px 0;break-inside:avoid}',
        '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    ].join('\n');

    // ── assemble full HTML ─────────────────────────────────────────────────────
    var cvTitle = esc(t('pdfTitle'));
    var cvSub   = esc(t('pdfSubtitle'));
    var secVisit = esc(t('pdfSectionVisits'));
    var secCountries = esc(t('pdfSectionCountries'));
    var lbl = {
        countries : esc(t('pdfCountries')),
        cities    : esc(t('pdfCities')),
        trips     : esc(t('pdfTrips')),
        days      : esc(t('pdfDays')),
        generated : esc(t('pdfGenerated'))
    };

    var html = '<!DOCTYPE html><html lang="' + (window.LANG === 'en' ? 'en' : 'uk') + '"><head><meta charset="UTF-8">' +
        '<title>' + cvTitle + '</title>' +
        '<style>' + css + '</style></head><body>' +
        '<div class="cv">' +
            '<div class="cv-ti">' + cvTitle + '</div>' +
            '<div class="cv-su">' + cvSub + '</div>' +
            '<div class="cv-st">' +
                '<div class="cv-s"><span class="cv-sn">' + countriesVisited.length + '</span><span class="cv-sl">' + lbl.countries + '</span></div>' +
                '<div class="cv-s"><span class="cv-sn">' + citiesVisited.length    + '</span><span class="cv-sl">' + lbl.cities    + '</span></div>' +
                '<div class="cv-s"><span class="cv-sn">' + visitsSorted.length     + '</span><span class="cv-sl">' + lbl.trips     + '</span></div>' +
                '<div class="cv-s"><span class="cv-sn">' + totalDays               + '</span><span class="cv-sl">' + lbl.days      + '</span></div>' +
            '</div>' +
            '<div class="cv-yr">' + yearRange + '</div>' +
            '<div class="cv-gd">' + lbl.generated + ': ' + genDate + '</div>' +
        '</div>' +
        '<div class="sec sb"><h1 class="sh">' + secVisit + '</h1>' + visitSec + '</div>' +
        '<div class="sec sb"><h1 class="sh">' + secCountries + ' (' + countriesVisited.length + ')</h1>' + countrySec + '</div>' +
        '</body></html>';

    // ── open and print ─────────────────────────────────────────────────────────
    var w = window.open('', '_blank');
    if (!w) {
        alert(t('setMsgNoPopup'));
        return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(function() { w.print(); }, 600);
}

//08.08 Export to CSV backup: tabbed HTML viewer, one tab per data array, per-sheet CSV download
function exportToCsv() {

    // ── helpers ────────────────────────────────────────────────────────────────
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function cellVal(v) {
        if (v == null) { return ''; }
        if (typeof v === 'object') { return JSON.stringify(v); }
        return String(v);
    }

    // ── data tabs (ordered logically) ─────────────────────────────────────────
    var TABS = [
        { id: 'continent',    label: t('setContinents'),    arr: data.continent    || [] },
        { id: 'country',      label: t('setCountries'),     arr: data.country      || [] },
        { id: 'area',         label: t('setRegions'),       arr: data.area         || [] },
        { id: 'city',         label: t('setLocations'),     arr: data.city         || [] },
        { id: 'visit',        label: t('setVisits'),        arr: data.visit        || [] },
        { id: 'type',         label: t('setLocationTypes'), arr: data.type         || [] },
        { id: 'country_type', label: t('setCountryTypes'),  arr: data.country_type || [] }
    ];

    // Preferred column order per array
    var PREF = {
        continent:    ['continent_id','name','name_ua','name_nt'],
        country:      ['country_id','continent_id','continent_id2','name','name_ua','name_nt','short_name','country_type_id','city_state','small_flag_img','flag_img','emb_img','map_img'],
        area:         ['region_id','country_id','name','name_ua','name_nt','active'],
        city:         ['city_id','region_id','name','name_ua','name_nt','capital','lat','long','type_id','image','description'],
        visit:        ['start_date','end_date','city','days','photos','story','story_url'],
        type:         ['type_id','name','name_ua'],
        country_type: ['country_type_id','name','name_ua']
    };

    // ── build column list for one array ───────────────────────────────────────
    function getCols(tabId, arr) {
        var pref = PREF[tabId] || [];
        // Collect all keys that actually appear, in first-seen order
        var allKeys = {}, keyOrder = [];
        $.each(arr, function(i, obj) {
            $.each(obj, function(k) {
                if (!allKeys[k]) { allKeys[k] = true; keyOrder.push(k); }
            });
        });
        // Start with preferred cols that exist; then append remaining
        var cols = pref.filter(function(k) { return !!allKeys[k]; });
        var colSet = {};
        cols.forEach(function(k) { colSet[k] = true; });
        keyOrder.forEach(function(k) { if (!colSet[k]) { colSet[k] = true; cols.push(k); } });
        return cols;
    }

    // ── build HTML table for one tab ──────────────────────────────────────────
    function buildTable(tab) {
        var arr  = tab.arr;
        var cols = getCols(tab.id, arr);

        var thead = '<tr>' + cols.map(function(c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
        var tbodyParts = [];
        $.each(arr, function(i, obj) {
            var tds = cols.map(function(col) {
                var raw  = cellVal(obj[col]);
                var disp = raw.length > 80 ? raw.substring(0, 78) + '…' : raw;
                return '<td data-raw="' + esc(raw) + '" title="' + esc(raw) + '">' + esc(disp) + '</td>';
            }).join('');
            tbodyParts.push('<tr>' + tds + '</tr>');
        });

        return '<table id="tbl-' + tab.id + '"><thead>' + thead + '</thead><tbody>' +
            tbodyParts.join('') + '</tbody></table>';
    }

    // ── assemble nav + panels ─────────────────────────────────────────────────
    var navHtml = '', panelsHtml = '', totalRows = 0, firstId = '';
    $.each(TABS, function(i, tab) {
        if (!tab.arr.length) { return; }
        totalRows += tab.arr.length;
        var isFirst = (firstId === '');
        if (isFirst) { firstId = tab.id; }
        var act = isFirst ? ' act' : '';

        navHtml += '<button class="tb' + act + '" data-tab="' + tab.id +
            '" onclick="showTab(\'' + tab.id + '\')">' +
            esc(tab.label) + '<span class="tc">' + tab.arr.length + '</span></button>';

        var fname = tab.id + '.csv';
        panelsHtml += '<div id="tp-' + tab.id + '" class="tp' + act + '">' +
            '<div class="bar">' +
                '<button class="dl" onclick="dlCsv(\'' + tab.id + '\',\'' + fname + '\')">' +
                    '&#8595; ' + esc(tab.label) + '.csv' +
                '</button>' +
                '<span class="bc">' + tab.arr.length + ' ' + t('csvRecords') + '</span>' +
            '</div>' +
            '<div class="tw">' + buildTable(tab) + '</div>' +
            '</div>';
    });

    // ── CSS ────────────────────────────────────────────────────────────────────
    var css = [
        'body{margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;background:#f5f7fa;color:#1a1a1a}',
        '.hd{background:#1d4ed8;color:#fff;padding:10px 18px;display:flex;align-items:center;gap:14px;flex-shrink:0;flex-wrap:wrap}',
        '.hd h1{font-size:15px;margin:0;font-weight:600}',
        '.hs{font-size:11px;opacity:.7;flex:1}',
        '.dlall{margin-left:auto;padding:6px 14px;background:#fff;color:#1d4ed8;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700}',
        '.dlall:hover{background:#e0e7ff}',
        '.tnav{display:flex;gap:3px;padding:8px 10px 0;background:#fff;border-bottom:2px solid #1d4ed8;flex-wrap:wrap}',
        '.tb{padding:7px 13px;border:1px solid #cbd5e1;border-bottom:none;border-radius:4px 4px 0 0;cursor:pointer;background:#f0f4ff;font-size:11.5px;color:#374151}',
        '.tb.act{background:#fff;border-color:#1d4ed8;color:#1d4ed8;font-weight:700;margin-bottom:-2px;border-bottom:2px solid #fff}',
        '.tc{background:#e0e7ff;color:#1d4ed8;font-size:10px;border-radius:10px;padding:1px 6px;margin-left:5px;font-weight:700;vertical-align:middle}',
        '.tb.act .tc{background:#1d4ed8;color:#fff}',
        '.tp{display:none;padding:10px}',
        '.tp.act{display:block}',
        '.bar{display:flex;align-items:center;gap:14px;margin-bottom:8px}',
        '.dl{padding:5px 12px;background:#1d4ed8;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11.5px;font-weight:600}',
        '.dl:hover{background:#1e40af}',
        '.bc{font-size:11px;color:#888}',
        '.tw{overflow:auto;max-height:calc(100vh - 145px);border:1px solid #e5e7eb;border-radius:4px;background:#fff}',
        'table{border-collapse:collapse;min-width:100%;font-size:11.5px}',
        'thead{position:sticky;top:0;z-index:2}',
        'th{background:#1d4ed8;color:#fff;padding:6px 10px;text-align:left;white-space:nowrap;font-weight:600;border-right:1px solid rgba(255,255,255,.18)}',
        'th:last-child{border-right:none}',
        'td{padding:4px 10px;border-bottom:1px solid #e5e7eb;white-space:nowrap;max-width:280px;overflow:hidden;text-overflow:ellipsis;border-right:1px solid #f0f0f0;color:#111}',
        'td:last-child{border-right:none}',
        'tr:nth-child(even) td{background:#f9fafb}',
        'tr:hover td{background:#eff6ff!important}'
    ].join('\n');

    // ── inline script for new window ──────────────────────────────────────────
    var js = [
        'function showTab(id){',
        '  document.querySelectorAll(".tb").forEach(function(b){b.classList.remove("act");});',
        '  document.querySelectorAll(".tp").forEach(function(p){p.classList.remove("act");});',
        '  document.getElementById("tp-"+id).classList.add("act");',
        '  document.querySelector("[data-tab=\'"+id+"\']").classList.add("act");',
        '}',
        'function dlCsv(id,fname){',
        '  var tbl=document.getElementById("tbl-"+id);',
        '  var rows=tbl.querySelectorAll("tr");',
        '  var lines=[];',
        '  rows.forEach(function(r){',
        '    var cells=r.querySelectorAll("th,td");',
        '    var vals=[];',
        '    cells.forEach(function(c){',
        '      var v=c.hasAttribute("data-raw")?c.getAttribute("data-raw"):c.textContent;',
        '      vals.push(\'"\'+v.replace(/"/g,\'""\')+\'"\');',
        '    });',
        '    lines.push(vals.join(","));',
        '  });',
        '  var a=document.createElement("a");',
        '  a.href=URL.createObjectURL(new Blob(["\\uFEFF"+lines.join("\\r\\n")],{type:"text/csv;charset=utf-8"}));',
        '  a.download=fname;',
        '  document.body.appendChild(a);a.click();document.body.removeChild(a);',
        '}',
        'function dlAll(){',
        '  var tabs=document.querySelectorAll(".tb");',
        '  var delay=0;',
        '  tabs.forEach(function(btn){',
        '    var id=btn.getAttribute("data-tab");',
        '    setTimeout(function(){dlCsv(id,id+".csv");},delay);',
        '    delay+=500;',
        '  });',
        '}'
    ].join('\n');

    // ── assemble full HTML ─────────────────────────────────────────────────────
    var genDate = new Date().toLocaleDateString(window.LANG === 'en' ? 'en-GB' : 'uk-UA');
    var hdTitle = esc(t('csvTitle'));
    var hdSub   = esc(genDate + ' • ' + totalRows + ' ' + t('csvRecords'));

    var html = '<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8">' +
        '<title>' + hdTitle + '</title>' +
        '<style>' + css + '</style></head><body>' +
        '<div class="hd"><h1>' + hdTitle + '</h1><span class="hs">' + hdSub + '</span>' +
        '<button class="dlall" onclick="dlAll()">&#8595; ' + esc(t('csvDownloadAll')) + '</button></div>' +
        '<div class="tnav">' + navHtml + '</div>' +
        panelsHtml +
        '<scr' + 'ipt>' + js + '<' + '/script>' +
        '</body></html>';

    // ── open window ────────────────────────────────────────────────────────────
    var w = window.open('', '_blank');
    if (!w) {
        alert(t('setMsgNoPopupCsv'));
        return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
}

//08.09 Generate and download DATA/globaldb.json from current in-memory data
function generateGlobalDb() {
    var msg = function(cls, html) {
        var el = document.getElementById('globaldbGenMsg');
        if (el) { el.className = 'set-alert ' + cls; el.innerHTML = html; }
    };
    msg('', t('setMsgComparing'));

    $.ajax({ url: 'DATA/globaldb.json', dataType: 'text', cache: false })
        .always(function(rawOrXhr) {
            var existing = null;
            if (typeof rawOrXhr === 'string') {
                try { existing = JSON.parse(rawOrXhr); } catch(e) {}
            }

            // Per-array config: key extractor + plural forms (UK: [1, 2-4, 5+]; EN: singular base)
            var ARRAYS = [
                { key: 'continent',    fn: function(x) { return x.continent_id; },                           forms: ['континент',  'континенти',  'континентів'],   formsEn: 'continent' },
                { key: 'country',      fn: function(x) { return x.country_id; },                             forms: ['країну',     'країни',      'країн'],         formsEn: 'country' },
                { key: 'area',         fn: function(x) { return x.country_id + ':' + x.region_id; },        forms: ['регіон',     'регіони',     'регіонів'],      formsEn: 'region' },
                { key: 'city',         fn: function(x) { return x.city_id; },                                forms: ['місто',      'міста',       'міст'],          formsEn: 'city' },
                { key: 'visit',        fn: function(x) { return x.start_date + ' — ' + x.end_date; },       forms: ['візит',      'візити',      'візитів'],       formsEn: 'visit' },
                { key: 'type',         fn: function(x) { return x.type_id; },                                forms: ['тип',        'типи',        'типів'],         formsEn: 'type' },
                { key: 'country_type', fn: function(x) { return x.country_type_id; },                        forms: ['тип країни', 'типи країн',  'типів країн'],   formsEn: 'country type' }
            ];

            function plural(n, forms) {
                var last = n % 10, two = n % 100;
                if (two >= 11 && two <= 14) { return n + ' ' + forms[2]; }
                if (last === 1)             { return n + ' ' + forms[0]; }
                if (last >= 2 && last <= 4) { return n + ' ' + forms[1]; }
                return n + ' ' + forms[2];
            }

            function stableStringify(obj) {
                if (Array.isArray(obj)) { return '[' + obj.map(stableStringify).join(',') + ']'; }
                if (typeof obj === 'object' && obj !== null) {
                    return '{' + Object.keys(obj).sort().map(function(k) {
                        return JSON.stringify(k) + ':' + stableStringify(obj[k]);
                    }).join(',') + '}';
                }
                return JSON.stringify(obj);
            }

            var diffLines = [];
            if (existing) {
                $.each(ARRAYS, function(i, cfg) {
                    var newArr = data[cfg.key] || [];
                    var oldArr = existing[cfg.key] || [];
                    var oldMap = {}, newKeys = {};
                    $.each(oldArr, function(j, x) { oldMap[cfg.fn(x)] = x; });
                    $.each(newArr, function(j, x) { newKeys[cfg.fn(x)] = true; });

                    var added = [], removed = [], changed = [];
                    $.each(newArr, function(j, x) {
                        var k = cfg.fn(x);
                        if (!oldMap[k]) { added.push(k); }
                        else if (stableStringify(oldMap[k]) !== stableStringify(x)) { changed.push(k); }
                    });
                    $.each(oldArr, function(j, x) { if (!newKeys[cfg.fn(x)]) { removed.push(cfg.fn(x)); } });

                    var MAX = 6;
                    function clip(arr) { return arr.slice(0, MAX).join(', ') + (arr.length > MAX ? '…' : ''); }
                    function pStr(n) { return window.LANG === 'en' ? n + ' ' + cfg.formsEn + (n === 1 ? '' : 's') : plural(n, cfg.forms); }
                    if (added.length)   { diffLines.push('&#10133; ' + t('setDiffAdded')   + ' ' + pStr(added.length)   + ': <b>' + clip(added)   + '</b>'); }
                    if (removed.length) { diffLines.push('&#10134; ' + t('setDiffRemoved') + ' ' + pStr(removed.length) + ': <b>' + clip(removed) + '</b>'); }
                    if (changed.length) { diffLines.push('&#9998; '  + t('setDiffChanged') + ' ' + pStr(changed.length) + ': <b>' + clip(changed) + '</b>'); }
                });
            }

            // Serialize: 2-space indent, CRLF line endings (same as source file)
            var json = JSON.stringify(data, null, 2);
            var crlf = json.replace(/\r\n|\r|\n/g, '\r\n');

            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([crlf], { type: 'application/json;charset=utf-8' }));
            a.download = 'globaldb.json';
            document.body.appendChild(a); a.click(); URL.revokeObjectURL(a.href); document.body.removeChild(a);

            var head = t('setOkGlobaldbHead');
            var body = !existing         ? t('setDiffNoPrev') :
                       !diffLines.length ? t('setDiffNoChangesGlob') :
                       diffLines.join('<br>');
            msg('is-ok', head + '<br>' + body);
        });
}