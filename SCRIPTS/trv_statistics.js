//09. Statistics page

//09.01 Creator of page
function createStatisticsPage_HTML() {
    setActiveNav("navStats");

    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?page=statistics"); }

    document.getElementById("mainSection").innerHTML =
        "<div class='stats-page'>" +
            "<h1 class='stats-title'>Статистика</h1>" +
            "<section class='stats-block'>" + statsBlockSummary_HTML() + "</section>" +
            "<section class='stats-block'>" + statsBlockRecords_HTML() + "</section>" +
            "<section class='stats-block'>" + statsBlockDonuts_HTML() + "</section>" +
            "<section class='stats-block'>" + statsBlockYears_HTML() + "</section>" +
            "<section class='stats-block'>" + statsBlockTrends_HTML() + "</section>" +
            "<section class='stats-block'>" + statsBlockTop_HTML() + "</section>" +
        "</div>";

    document.getElementById("copy_cert").innerHTML = "&copy; 2011-" + new Date().getFullYear() + ", Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//09.02 Block 1 — summary tiles: geography / trips / time
function statsBlockSummary_HTML() {
    //Geography
    var countries = countriesVisited.length;
    var regions = regionsVisited.length;
    var cities = citiesVisited.length;

    //Trips + totals across all visits
    var trips = visitsSorted.length;
    var totalCityVisits = 0;   //all location visits, counting repeats
    var totalDays = 0;
    var oneDayTrips = 0;       //trips that start and end on the same day
    var twoWeekTrips = 0;      //trips longer than two weeks (> 14 days)
    var DAY = 1000 * 60 * 60 * 24;
    $.each (visitsSorted, function( i, v ){
        totalCityVisits += (v.cities ? v.cities.length : 0);
        var days = Math.round((v.end_date - v.start_date) / DAY) + 1;
        totalDays += days;
        if (days === 1) { oneDayTrips += 1; }
        if (days > 14) { twoWeekTrips += 1; }
    });

    //Average locations per trip (counts every visit, repeats included)
    var avgLocPerTrip  = trips ? (totalCityVisits / trips) : 0;
    var months         = totalDays / 30.44;
    var years          = totalDays / 365.25;
    var avgDaysPerTrip = trips ? (totalDays / trips) : 0;

    return "<div class='stat-grid stat-tiles-full'>" +
        //Card 1 — geography
        "<div class='stat-tile'>" +
            "<div class='num'>" + countries + "</div><div class='lbl'>Країн відвідано</div>" +
            "<div class='sub'>" +
                "<div class='sub-row'><b>" + regions + "</b> регіонів відвідано</div>" +
                "<div class='sub-row'><b>" + totalCityVisits + "</b> локацій відвідано</div>" +
                "<div class='sub-row'><b>" + cities + "</b> унікальних локацій відвідано</div>" +
            "</div>" +
        "</div>" +
        //Card 2 — trips
        "<div class='stat-tile'>" +
            "<div class='num'>" + trips + "</div><div class='lbl'>Поїздок</div>" +
            "<div class='sub'>" +
                "<div class='sub-row'><b>&asymp; " + statsFmt1(avgLocPerTrip) + "</b> локацій за поїздку</div>" +
                "<div class='sub-row'><b>" + oneDayTrips + "</b> (" + (trips ? Math.round(oneDayTrips / trips * 100) : 0) + "%) одноденних поїздок</div>" +
                "<div class='sub-row'><b>" + twoWeekTrips + "</b> (" + (trips ? Math.round(twoWeekTrips / trips * 100) : 0) + "%) поїздок понад 2 тижні</div>" +
            "</div>" +
        "</div>" +
        //Card 3 — time
        "<div class='stat-tile'>" +
            "<div class='num'>" + totalDays + "</div><div class='lbl'>Днів у подорожах</div>" +
            "<div class='sub'>" +
                "<div class='sub-row'><b>&asymp; " + Math.round(months) + " місяців</b></div>" +
                "<div class='sub-row'><b>&asymp; " + statsFmt2(years) + " року</b></div>" +
                "<div class='sub-row'><b>&asymp; " + statsFmt2(avgDaysPerTrip) + " дня</b> за поїздку</div>" +
            "</div>" +
        "</div>" +
    "</div>";
}

//09.03 Format a number with one decimal, Ukrainian comma separator
function statsFmt1(n) {
    return n.toFixed(1).replace(".", ",");
}

//09.03a Format a number with two decimals, Ukrainian comma separator
function statsFmt2(n) {
    return n.toFixed(2).replace(".", ",");
}

//09.04 Block 2 — records: first / longest trip, most locations, most frequent country
function statsBlockRecords_HTML() {
    if (!visitsSorted.length) { return ""; }

    var DAY = 1000 * 60 * 60 * 24;

    //First trip — visitsSorted is sorted descending, so the last element is the earliest
    var firstVisit = visitsSorted[visitsSorted.length - 1];
    var firstSub = statsCityCountry(firstVisit);

    //Longest trip — by inclusive number of days
    var longestVisit = null, longestDays = 0;
    $.each (visitsSorted, function( i, v ){
        var days = Math.round((v.end_date - v.start_date) / DAY) + 1;
        if (days > longestDays) { longestDays = days; longestVisit = v; }
    });
    var longestCountry = (longestVisit && longestVisit.cities.length) ? getUaCountryName(longestVisit.cities[0].country_id) : "";
    var longestSub = [longestCountry, longestVisit ? longestVisit.start_date.getFullYear() : ""]
                     .filter(function(s){ return s !== "" && s !== undefined; }).join(", ");

    //Country with the most unique visited locations (+ number of trips there)
    var topLocCountry = "", topLocShort = "", topLocCount = 0;
    $.each (countriesVisited, function( i, c ){
        var n = c.getNumberOfVisitedCities();
        if (n > topLocCount) { topLocCount = n; topLocCountry = c.name_ua; topLocShort = c.short_name; }
    });
    var topLocTrips = 0;
    $.each (visitsSorted, function( i, v ){
        var has = false;
        $.each (v.cities, function( j, city ){ if (city.country_id == topLocShort) { has = true; } });
        if (has) { topLocTrips += 1; }
    });

    //Visited capitals
    var capitals = 0;
    $.each (citiesVisited, function( i, c ){ if (c.capital) { capitals += 1; } });

    var topLocSub = setLocationNumberWithCorrectEnd(topLocCount) + "<br>" + setVisitsNumberWithCorrectEnd(topLocTrips);

    return "<div class='stat-grid stat-records'>" +
            statsRecCard("🚩", "Перша поїздка", statsFmtDate(firstVisit.start_date), firstSub) +
            statsRecCard("⏱️", "Найдовша поїздка", longestDays + " " + parseWord("д", "ень", "ні", "нів", longestDays), longestSub) +
            statsRecCard("📍", "Найбільше локацій", topLocCountry, topLocSub) +
            statsRecCard("🏛️", "Відвідано столиць", capitals, "з " + countriesVisited.length + " країн") +
        "</div>";
}

//09.05 One record card
function statsRecCard(emo, label, value, sub) {
    return "<div class='stat-rec'><span class='emo'>" + emo + "</span>" +
           "<div class='rl'>" + label + "</div>" +
           "<div class='rv'>" + value + "</div>" +
           "<div class='rs'>" + sub + "</div></div>";
}

//09.06 "City, Country" label of a visit's first location
function statsCityCountry(visit) {
    if (!visit.cities.length) { return ""; }
    var city = getUaLocationName(visit.cities[0].city_id);
    var country = getUaCountryName(visit.cities[0].country_id);
    return [city, country].filter(function(s){ return s; }).join(", ");
}

//09.07 Format a Date object as dd.mm.yyyy
function statsFmtDate(d) {
    var dd = ("0" + d.getDate()).slice(-2);
    var mm = ("0" + (d.getMonth() + 1)).slice(-2);
    return dd + "." + mm + "." + d.getFullYear();
}

//09.08 Block 3 — donut charts: continents / country type / cross-border trips
function statsBlockDonuts_HTML() {
    //1 — countries per (primary) continent
    var contColors = { EU:"#2563eb", AS:"#22c55e", AF:"#eab308", NA:"#ef4444", SA:"#a855f7", AO:"#06b6d4", CA:"#f97316", AN:"#94a3b8" };
    var contSegs = [];
    $.each (data.continent, function( i, cont ){
        var n = 0;
        $.each (countriesVisited, function( j, c ){
            if (c.continent_id == cont.continent_id) { n += 1; }
        });
        if (n > 0) { contSegs.push({ label: cont.name_ua, value: n, color: contColors[cont.continent_id] || "#94a3b8" }); }
    });

    //2 — countries by type (list the countries for every type except "1" = визнана)
    var typeColors = { "1":"#22c55e", "2":"#eab308", "3":"#ef4444", "4":"#3b82f6" };
    var typeSegs = [];
    $.each (data.country_type, function( i, t ){
        var names = [];
        $.each (countriesVisited, function( j, c ){
            if (c.country_type_id == t.country_type_id) { names.push(c.name_ua); }
        });
        if (names.length > 0) {
            var seg = { label: t.name_ua, value: names.length, color: typeColors[t.country_type_id] || "#94a3b8" };
            if (t.country_type_id != "1") { seg.names = names; }
            typeSegs.push(seg);
        }
    });

    //3 — cross-border trips (more than one distinct country within a single trip)
    var multi = 0, single = 0;
    $.each (visitsSorted, function( i, v ){
        var seen = {}, cnt = 0;
        $.each (v.cities, function( j, city ){
            if (!seen[city.country_id]) { seen[city.country_id] = true; cnt += 1; }
        });
        if (cnt > 1) { multi += 1; } else if (cnt === 1) { single += 1; }
    });
    var tripSegs = [
        { label: "Кілька країн", value: multi,  color: "#2563eb" },
        { label: "Одна країна",  value: single, color: "#94a3b8" }
    ];

    return "<div class='stat-grid stat-donuts'>" +
            statsDonut_HTML("Країни за континентами", contSegs, "країн") +
            statsDonut_HTML("Країни за типом", typeSegs, "країн") +
            statsDonut_HTML("Крос-граничні поїздки", tripSegs, "поїздок") +
        "</div>";
}

//09.09 Build a single donut chart (conic-gradient ring + center total + legend)
function statsDonut_HTML(title, segs, centerLabel) {
    var total = 0;
    $.each (segs, function( i, s ){ total += s.value; });

    var acc = 0, stops = [], legend = "";
    $.each (segs, function( i, s ){
        var start = total ? (acc / total * 100) : 0;
        acc += s.value;
        var end = total ? (acc / total * 100) : 0;
        stops.push(s.color + " " + start + "% " + end + "%");

        var pct = total ? Math.round(s.value / total * 100) : 0;
        var info = (s.names && s.names.length)
            ? " <span class='ns-info' title='" + s.names.join(", ").replace(/'/g, "’") + "'>і</span>"
            : "";
        legend += "<div class='lg'><span class='sw' style='background:" + s.color + "'></span>" +
                  "<span class='ln'>" + s.label + info + "</span><span class='lv'>" + s.value + " &middot; " + pct + "%</span></div>";
    });

    var ring = total
        ? "background:conic-gradient(" + stops.join(",") + ")"
        : "background:var(--border)";

    return "<div class='donut-card'><h4>" + title + "</h4>" +
        "<div class='donut-wrap'>" +
            "<div class='donut' style='" + ring + "'></div>" +
            "<div class='donut-hole'><span class='dt'>" + total + "</span><span class='dl'>" + centerLabel + "</span></div>" +
        "</div>" +
        "<div class='donut-legend'>" + legend + "</div></div>";
}

//09.10 Block 4 — trips per year (only years that actually have trips)
function statsBlockYears_HTML() {
    if (!visitsSorted.length) { return ""; }

    var byYear = {};
    $.each (visitsSorted, function( i, v ){
        var y = v.start_date.getFullYear();
        byYear[y] = (byYear[y] || 0) + 1;
    });

    var years = [];
    for (var y in byYear) { years.push(parseInt(y, 10)); }
    years.sort(function( a, b ){ return a - b; });

    var maxN = 0, peakYear = years.length ? years[0] : "";
    $.each (years, function( i, yr ){ if (byYear[yr] > maxN) { maxN = byYear[yr]; peakYear = yr; } });

    var numYears = years.length;
    var cols = "", yrs = "";
    $.each (years, function( i, yr ){
        var n = byYear[yr];
        var h = maxN ? Math.round(n / maxN * 100) : 0;
        cols += "<div class='stat-col' title='" + yr + ": " + setVisitsNumberWithCorrectEnd(n) + "'>" +
                "<span class='cnt'>" + n + "</span>" +
                "<span class='bar' style='height:" + h + "%'></span></div>";
        if (i === 0 || yr % 5 === 0) {   //first year + every multiple of 5
            yrs += "<span style='left:" + ((i + 0.5) / numYears * 100).toFixed(2) + "%'>" + yr + "</span>";
        }
    });

    return "<div class='trend-card'>" +
        "<div class='trend-head'><h4>Поїздки за роками</h4><span class='pk'>пік: " + maxN + " (" + peakYear + ")</span></div>" +
        "<div class='stat-chart' style='padding:0; border:0; box-shadow:none'>" +
            "<div class='stat-cols'>" + cols + "</div>" +
            "<div class='stat-years'>" + yrs + "</div>" +
        "</div>" +
    "</div>";
}

//09.11 Block 5 — trends: countries/year, new countries/year (line), trips/month (heat strip)
function statsBlockTrends_HTML() {
    if (!visitsSorted.length) { return ""; }

    var MONTHS = ["Січ","Лют","Бер","Кві","Тра","Чер","Лип","Сер","Вер","Жов","Лис","Гру"];

    var byYearC = {};      //year -> { short_name: true } (distinct countries that year)
    var firstYear = {};    //short_name -> earliest visited year
    var byMonth = {};      //month index -> trip count
    $.each (visitsSorted, function( i, v ){
        var y = v.start_date.getFullYear();
        byMonth[v.start_date.getMonth()] = (byMonth[v.start_date.getMonth()] || 0) + 1;
        if (!byYearC[y]) { byYearC[y] = {}; }
        $.each (v.cities, function( j, city ){
            var s = city.country_id;
            byYearC[y][s] = true;
            if (firstYear[s] === undefined || y < firstYear[s]) { firstYear[s] = y; }
        });
    });

    //Series 1 — distinct countries per year
    var years = [];
    for (var yk in byYearC) { years.push(parseInt(yk, 10)); }
    years.sort(function( a, b ){ return a - b; });
    var series1 = $.map(years, function( yr ){
        var cnt = 0;
        for (var k in byYearC[yr]) { cnt += 1; }
        return { year: yr, value: cnt };
    });

    //Series 2 — new countries per year (only years that have new ones); tooltip lists them
    var newByYear = {};
    for (var s in firstYear) { var fy = firstYear[s]; (newByYear[fy] = newByYear[fy] || []).push(s); }
    var newYears = [];
    for (var nk in newByYear) { newYears.push(parseInt(nk, 10)); }
    newYears.sort(function( a, b ){ return a - b; });
    var series2 = [], tips2 = [];
    $.each (newYears, function( i, yr ){
        var shorts = newByYear[yr];
        series2.push({ year: yr, value: shorts.length });
        var names = $.map(shorts, function( sh ){ return getUaCountryName(sh) || sh; });
        tips2.push(yr + ": " + names.join(", "));
    });

    //Months
    var monthsData = $.map(MONTHS, function( nm, idx ){ return { name: nm, value: byMonth[idx] || 0 }; });

    var tips1 = $.map(series1, function( s ){ return s.year + ": " + setCountriesNumberWithCorrectEnd(s.value) + " відвідано"; });

    return statsLineChart_HTML("Країн відвідано за рік", series1, "#2563eb", tips1) +
        statsLineChart_HTML("Нових країн відвідано за рік", series2, "#22c55e", tips2) +
        statsHeatMonths_HTML("Поїздки за місяцями", monthsData);
}

//09.12 Line (trend) chart: SVG line + area, with value labels and hover tooltips
function statsLineChart_HTML(title, series, color, tips) {
    var n = series.length;
    var max = 1;
    $.each (series, function( i, s ){ if (s.value > max) { max = s.value; } });
    var pts = [], overlay = "", labels = "", peak = series[0];
    $.each (series, function( i, s ){
        var x = n > 1 ? (i / (n - 1) * 100) : 50;
        var y = 100 - (s.value / max * 78) - 8;
        pts.push(x.toFixed(2) + "," + y.toFixed(2));

        if (tips && tips[i]) {
            var w = n > 1 ? (100 / (n - 1)) : 100;
            overlay += "<span class='hit' style='left:" + x + "%; width:" + w + "%' title='" + tips[i].replace(/'/g, "’") + "'></span>";
        }
        overlay += "<span class='pt' style='left:" + x + "%; top:" + y + "%'></span>";
        if (s.value > 0) { overlay += "<span class='vlbl' style='left:" + x + "%; top:" + y + "%'>" + s.value + "</span>"; }

        if (i === 0 || s.year % 5 === 0) {   //first year + every multiple of 5
            labels += "<span style='left:" + x + "%'>" + s.year + "</span>";
        }
        if (s.value > peak.value) { peak = s; }
    });

    var line = pts.join(" ");
    var area = (n > 1 ? "0,100 " : "50,100 ") + line + (n > 1 ? " 100,100" : " 50,100");

    return "<div class='trend-card'>" +
        "<div class='trend-head'><h4>" + title + "</h4><span class='pk'>пік: " + peak.value + " (" + peak.year + ")</span></div>" +
        "<div class='trend-box' style='color:" + color + "'>" +
            "<svg class='trend-svg' viewBox='0 0 100 100' preserveAspectRatio='none'>" +
                "<polygon points='" + area + "' fill='" + color + "' fill-opacity='0.13'/>" +
                "<polyline points='" + line + "' fill='none' stroke='" + color + "' stroke-width='2' vector-effect='non-scaling-stroke' stroke-linejoin='round' stroke-linecap='round'/>" +
            "</svg>" +
            "<div class='trend-pts'>" + overlay + "</div>" +
        "</div>" +
        "<div class='trend-labels'>" + labels + "</div></div>";
}

//09.13 Month heat strip (intensity = colour) — M3 design
function statsHeatMonths_HTML(title, months) {
    var max = 1, peak = months[0];
    $.each (months, function( i, m ){ if (m.value > max) { max = m.value; } });
    $.each (months, function( i, m ){ if (m.value > peak.value) { peak = m; } });

    var cells = "";
    $.each (months, function( i, m ){
        var a = 0.12 + m.value / max * 0.88;
        var txt = a > 0.55 ? "#fff" : "var(--text)";
        cells += "<div class='mh-cell' style='background:color-mix(in srgb, var(--accent) " + Math.round(a * 100) + "%, transparent); color:" + txt + "'>" +
                 "<div class='m'>" + m.name + "</div><div class='v'>" + m.value + "</div></div>";
    });

    return "<div class='trend-card'>" +
        "<div class='trend-head'><h4>" + title + "</h4><span class='pk'>пік: " + peak.name + " (" + peak.value + ")</span></div>" +
        "<div class='mh-heat'>" + cells + "</div></div>";
}

//09.14 Block 6 — top-7 lists: countries by visits / time / regions
function statsBlockTop_HTML() {
    if (!visitsSorted.length) { return ""; }

    var DAY = 1000 * 60 * 60 * 24;
    var byVisits = {}, byDays = {}, cityVisits = {};
    $.each (visitsSorted, function( i, v ){
        var days = Math.round((v.end_date - v.start_date) / DAY) + 1;
        var seen = {};
        $.each (v.cities, function( j, city ){
            cityVisits[city.city_id] = (cityVisits[city.city_id] || 0) + 1;
            if (!seen[city.country_id]) {
                seen[city.country_id] = true;
                byVisits[city.country_id] = (byVisits[city.country_id] || 0) + 1;
                byDays[city.country_id]   = (byDays[city.country_id]   || 0) + days;
            }
        });
    });

    //Top countries by visited regions — value shown as "visited з total" with a completion bar
    var regionRows = [];
    $.each (countriesVisited, function( i, c ){
        var total = 0;
        $.each (data.area, function( k, a ){ if (a.country_id == c.country_id && a.active != "N") { total += 1; } });
        regionRows.push({ name: c.name_ua, value: c.getNumberOfVisitedRegions(), total: total });
    });
    regionRows.sort(function( a, b ){ return b.value - a.value; });
    regionRows = regionRows.slice(0, 7);

    //Top cities by number of visits
    var cityRows = [];
    for (var cid in cityVisits) { cityRows.push({ name: getUaLocationName(cid) || cid, value: cityVisits[cid] }); }
    cityRows.sort(function( a, b ){ return b.value - a.value; });
    cityRows = cityRows.slice(0, 7);

    //Golden combo — countries where the capital and ALL active regions are visited
    var capCountries = {};
    $.each (citiesVisited, function( i, city ){ if (city.capital) { capCountries[city.getCountryId()] = true; } });
    var comboRows = [];
    $.each (countriesVisited, function( i, c ){
        if (!capCountries[c.short_name]) { return; }
        var visitedReg = c.getNumberOfVisitedRegions(), totalReg = 0;
        $.each (data.area, function( k, a ){ if (a.country_id == c.country_id && a.active != "N") { totalReg += 1; } });
        if (totalReg > 0 && visitedReg >= totalReg) { comboRows.push({ name: c.name_ua, value: visitedReg }); }
    });
    comboRows.sort(function( a, b ){ return b.value - a.value; });
    comboRows = comboRows.slice(0, 7);

    return "<div class='stat-grid top-grid'>" +
        statsTopCard("Топ країн за візитами", statsTopRows(byVisits), "") +
        statsTopCard("Топ міст за візитами", cityRows, "") +
        statsTopCard("Топ за регіонами", regionRows, "") +
        statsTopCard("Топ країн за часом перебування", statsTopRows(byDays), "дн") +
        statsTopCard("🥇 Золоте комбо", comboRows, "рег.", "Країни, де відвідано столицю та всі регіони.", "gold") +
    "</div>";
}

//09.15 Build sorted top-7 rows {name, value} from a {short_name: value} map
function statsTopRows(map) {
    var arr = [];
    for (var s in map) { arr.push({ name: getUaCountryName(s) || s, value: map[s] }); }
    arr.sort(function( a, b ){ return b.value - a.value; });
    return arr.slice(0, 7);
}

//09.16 One top-list card: header (title + expand icon) + ranked rows with bars
function statsTopCard(title, rows, unit, desc, mode) {
    var max = rows.length ? rows[0].value : 1;
    var gold = (mode === "gold");
    var html = "";
    $.each (rows, function( i, r ){
        var valText, bar = "";
        if (gold) {
            //Golden combo: no bar — every country is 100%, show a gold region badge
            valText = "<span class='top-gold'>" + r.value + (unit ? " " + unit : "") + "</span>";
        } else if (r.total !== undefined) {
            //Completion mode: bar = visited / total, label "visited з total"
            valText = r.value + " з " + r.total;
            bar = "<div class='bar'><span style='width:" + (r.total ? Math.round(r.value / r.total * 100) : 0) + "%'></span></div>";
        } else {
            //Ranking mode: bar relative to the list leader
            valText = r.value + (unit ? " " + unit : "");
            bar = "<div class='bar'><span style='width:" + (max ? Math.round(r.value / max * 100) : 0) + "%'></span></div>";
        }
        html += "<div class='top-row'>" +
                "<div class='body'><div class='line'><span class='tn'>" + r.name + "</span>" +
                "<span class='tv'>" + valText + "</span></div>" + bar + "</div></div>";
    });
    var d = desc ? "<p class='top-desc'>" + desc + "</p>" : "";
    //Expand icon — inactive for now (the expand behaviour will be wired later)
    var head = "<div class='tc-head'><h4>" + title + "</h4>" +
        "<button class='tc-expand' type='button' disabled aria-label='Розгорнути список' title='Розгорнути (скоро)'>" +
            "<svg viewBox='0 0 24 24'><path d='M6 9l6 6 6-6'/></svg>" +
        "</button></div>";
    return "<div class='top-card'>" + head + d + html + "</div>";
}
