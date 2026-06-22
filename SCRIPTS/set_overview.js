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
                '<li class="active" id="overview"><a onclick="javascript:createSettingsOverviewTab_HTML()" onmouseover="" style="cursor: pointer;">Огляд</a></li>' +
            '</ul>' +
            '<ul class="set-nav">' +
                '<li id="ctypes"><a onclick="javascript:createSettingsCountryTypeTab()" onmouseover="" style="cursor: pointer;">Типи країн</a></li>' +
                '<li id="types"><a onclick="javascript:createSettingsTypeTab()" onmouseover="" style="cursor: pointer;">Типи локацій</a></li>' +
                '<li id="continents"><a onclick="javascript:createSettingsContinentTab()" onmouseover="" style="cursor: pointer;">Континенти</a></li>' +
                '<li id="countries"><a onclick="javascript:createSettingsCountryTab()" onmouseover="" style="cursor: pointer;">Країни</a></li>' +
                '<li id="regions"><a onclick="javascript:createSettingsRegionTab()" onmouseover="" style="cursor: pointer;">Регіони</a></li>' +
                '<li id="cities"><a onclick="javascript:createSettingsCityTab()" onmouseover="" style="cursor: pointer;">Міста</a></li>' +
            '</ul>' +
            '<ul class="set-nav">' +
                '<li id="visits"><a onclick="javascript:createSettingsVisitTab()" onmouseover="" style="cursor: pointer;">Візити</a></li>' +
                '<li id="stories"><a onclick="javascript:createSettingsStoryTab()" onmouseover="" style="cursor: pointer;">Історії</a></li>' +
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
    removeAllAttributesByName("class", "active");
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
                kpi("Країни",  data.country.length, "відвідано: " + countriesVisited.length) +
                kpi("Регіони", data.area.length,    "відвідано: " + regionsVisited.length) +
                kpi("Міста",   data.city.length,    "відвідано: " + citiesVisited.length) +
                kpi("Візити",  visitsSorted.length, "") +
            '</div>' +
        '</section>' +
        // Data transformation — option rows (buttons are non-functional for now)
        '<section class="set-block">' +
            '<h2 class="set-block-title">Робота з даними</h2>' +
            '<div class="set-panel">' +
                '<div class="set-options">' +
                    '<div class="set-option">' +
                        '<div class="set-option-info">' +
                            '<div class="set-option-title">Експорт даних</div>' +
                            '<div class="set-option-desc">Зберегти базу подорожей у вибраному форматі</div>' +
                        '</div>' +
                        '<div class="set-option-actions">' +
                            '<button type="button" class="set-btn">PDF</button>' +
                            '<button type="button" class="set-btn">CSV</button>' +
                            '<button type="button" class="set-btn">MD</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="set-option">' +
                        '<div class="set-option-info">' +
                            '<div class="set-option-title">Автогенерація onload-сторінки</div>' +
                            '<div class="set-option-desc">Оновити onload сторінку щоб відобразити зміни в базі подорожей</div>' +
                        '</div>' +
                        '<div class="set-option-actions">' +
                            '<button type="button" class="set-btn set-btn-primary">Згенерувати</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="set-option">' +
                        '<div class="set-option-info">' +
                            '<div class="set-option-title">Валідація бази подорожей</div>' +
                            '<div class="set-option-desc">Перевірити структуру та цілісність зв’язків у базі подорожей</div>' +
                        '</div>' +
                        '<div class="set-option-actions">' +
                            '<button type="button" class="set-btn set-btn-primary">Перевірити</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</section>' +
        // Countries table
        '<section class="set-block">' +
            '<div class="set-block-head">' +
                '<h2 class="set-block-title">Країни</h2>' +
                '<label class="set-check"><input type="checkbox" onchange="javascript:toggleOnlyMissing(this.checked)"> Лише невідвідані</label>' +
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
            ? '<span class="cap-yes" title="Столицю відвідано">✓</span>'
            : '<span class="set-miss" title="Столицю не відвідано або не задана в базі">—</span>';

        var nameCell = visited ? "<a id='" + country.short_name + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + country.name_ua + "</a>"
                               : country.name_ua + " <span class='set-miss' title='Не відвідано'>✕</span>" ;

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
    data.country.sort(dynamicSort("name_ua"));
    var byCont = {};
    $.each(data.country, function( i, c ){ (byCont[c.continent_id] = byCont[c.continent_id] || []).push(c); });

    // continent header row also carries the column labels (repeated per continent)
    var body = "";
    $.each(data.continent, function( i, cont ){
        body += '<tr class="grp">' +
                    '<td class="grp-name">' + cont.name_ua + '</td>' +
                    '<td class="num">Столиця</td>' +
                    '<td class="num">Регіони</td>' +
                    '<td class="num">Міста</td>' +
                    '<td class="num">Візити</td>' +
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