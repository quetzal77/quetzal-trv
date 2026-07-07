//02.00 Services
//This file contains all the functions shared among all the other functions, so we can't use them for any another one function's file

//02.01 Create new AMMAP's map
function drawMap(){
    var url = (local[1].map_img != undefined) ? local[1].map_img : "worldLow.js" ;
    var mapFail = function() { $('#mapdiv').removeClass('loading').text('Map unavailable.'); };
    $.getScript("SCRIPTS/MAPS/ammap.js?v=" + APP_V, function() {
        $.getScript("SCRIPTS/MAPS/custommap.js?v=" + APP_V, function() {
            $.getScript("SCRIPTS/MAPS/" + url, function() {
                $('#mapdiv').removeClass('loading');
                $('#mapdiv').addClass('map');
                CreateMap();
            }).fail(mapFail);
        }).fail(mapFail);
    }).fail(mapFail);
}

//02.02 This method creates CUSTOM list of visits
function createListOfVisites(){
     //EXAMPLE: <div class="visityear">2025<span class="visityear-count">3 поїздки</span></div>
     //         <div class="visitrow"><div class="firstcell">5 - 10 жовтня</div>
     //                                <div class="secondcell"><a onclick="getCityPage(id)">Відень</a>, <a onclick="getCityPage(id)">Грац</a> (<a onclick="getCountryPage(id)">Австрія</a>)</div></div>
     var result = "";
     var VisitYear;
     var VisitYear_HTML = "";

     //Count visits per year (recomputed each render, so it updates when a visit is added)
     var visitsPerYear = {};
     $.each (visitsSorted, function( i, visit ) {
         var qualifies = (local[1].type != "city");
         if (local[1].type == "country") {
             qualifies = false;
             $.each (visit.cities, function( j, city ){
                 if (city.country_id == local[1].short_name) { qualifies = true; return false; }
             });
         }
         if (qualifies) {
             var visitYr = visit.start_date.getFullYear();
             visitsPerYear[visitYr] = (visitsPerYear[visitYr] || 0) + 1;
         }
     });

     $.each (visitsSorted, function( i, visit ) {
         //This section sets year
         if (visit.start_date.getFullYear() != VisitYear) {
            VisitYear = visit.start_date.getFullYear();
            VisitYear_HTML = "<div class='visityear'>" + VisitYear + "<span class='visityear-count'>" + setVisitsNumberWithCorrectEnd(visitsPerYear[VisitYear]) + "</span></div>";
         }

         //This section is responsible to create date section (skipped for the single-city view, which doesn't use it)
         var VisitDate = "";
         if (local[1].type != "city") {
             VisitDate = "<div class='firstcell'>" + getVisitDate (visit.start_date, visit.end_date).slice(0, -3) + "</div>";
         }

         //This section is responsible for displaying list of visited cities and countries
         switch (local[1].type) {
             case "country":
                 var citiesToReturn = "";
                 $.each (visit.cities, function( i, city ){
                     if (city.country_id == local[1].short_name) {
                         citiesToReturn += "<a id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                           getLocationName(city.city_id) + "</a>" + ", "
                     }
                 });
                 if (citiesToReturn != "") {
                    result += VisitYear_HTML;
                    result += "<div class='visitrow'>" + VisitDate + "<div class='secondcell'>" + citiesToReturn.slice(0, -2) + "</div></div>";
                    VisitYear_HTML = "";
                 }
                 break;
             case "city":
                 var distinctIds = {};
                 $.each (visit.cities, function( i, city ){
                    if (city.city_id == local[1].city_id) {
                        var date = getVisitDate (visit.start_date, visit.end_date, "year");
                        if (!distinctIds[date]){
                            result += date;
                            distinctIds[date] = true;
                        }
                    }
                 });
                 break;
             default:
                 var citiesToReturn = "";
                 var countriesToReturn = "";
                 var distinctIds = {};

                 result += VisitYear_HTML ;

                 $.each (visit.cities, function( i, city ){
                     citiesToReturn += "<a id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                      getLocationName(city.city_id) + "</a>" + ", ";
                     if (!distinctIds[city.country_id]){
                         countriesToReturn += "<a id='" + city.country_id + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                      getCountryName(city.country_id) + "</a>" + ", ";
                         distinctIds[city.country_id] = true;
                     }
                 });
                 result += "<div class='visitrow'>" + VisitDate + "<div class='secondcell'>" + citiesToReturn.slice(0, -2) + " (" + countriesToReturn.slice(0, -2) + ")</div></div>";
                 VisitYear_HTML = "";
         }
     });
     return result;
}

//02.02b This method creates the "Моє життя" timeline of places lived (residence-type visits).
//Pass a country short_name to scope the list to that country (used by the country page's "Моє життя" tab) —
//in that case the country link is omitted (redundant, we're already on that country's page).
function createListOfResidences(countryId){
    //EXAMPLE: <div class="visitrow"><div class="firstcell">1 грудня 1977 – 31 липня 2004</div>
    //                                <div class="secondcell"><a onclick="getCityPage(id)">Київ</a> (<a onclick="getCountryPage(id)">Україна</a>) <span class="life-duration">(26 років, 7 місяців, 30 днів)</span></div></div>
    var result = "";
    $.each (residencesSorted, function( i, r ){
        if (countryId && r.country_id != countryId) { return; }

        var period = getFullResidenceDate(r.start_date) + " – " +
                     (r.ongoing ? t('lifePresent') : getFullResidenceDate(r.end_date));
        var duration = formatDurationParts(dateDiffYMD(r.start_date, r.end_date));
        var cityLink = "<a id='" + r.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" + getLocationName(r.city_id) + "</a>";
        var countryLink = countryId ? "" :
            " (<a id='" + r.country_id + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + getCountryName(r.country_id) + "</a>)";

        result += "<div class='visitrow'><div class='firstcell'>" + period + "</div>" +
                   "<div class='secondcell'>" + cityLink + countryLink + " <span class='life-duration'>(" + duration + ")</span></div></div>";
    });
    return result;
}

//02.02c Full date as "1 грудня 1977" / "1 Dec 1977"
function getFullResidenceDate(date) {
    return date.getDate() + " " + getMonthName(date.getMonth() + 1) + " " + date.getFullYear();
}

//02.02d Calendar-exact difference between two dates as whole years/months/days (handles real month lengths)
function dateDiffYMD(start_date, end_date) {
    var years = end_date.getFullYear() - start_date.getFullYear();
    var months = end_date.getMonth() - start_date.getMonth();
    var days = end_date.getDate() - start_date.getDate();
    if (days < 0) {
        months -= 1;
        days += new Date(end_date.getFullYear(), end_date.getMonth(), 0).getDate(); // days in the month before end_date's month
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    if (years < 0) { years = 0; months = 0; days = 0; }
    return { years: years, months: months, days: days };
}

//02.02e Format {years, months, days} as "X років, Y місяців, Z днів" in the current language
function formatDurationParts(parts) {
    var out = [];
    if (parts.years > 0)  { out.push(ukPluralWord(parts.years, ['рік', 'роки', 'років'], 'year')); }
    if (parts.months > 0) { out.push(ukPluralWord(parts.months, ['місяць', 'місяці', 'місяців'], 'month')); }
    if (parts.days > 0 || out.length === 0) { out.push(ukPluralWord(parts.days, ['день', 'дні', 'днів'], 'day')); }
    return out.join(', ');
}

//02.02e2 Compact form of formatDurationParts: "44 рр, 7 міс, 26 дн" / "44 y, 7 mo, 26 d" — abbreviations don't
//decline except years, where Ukrainian uses "р" for exactly one year and "рр" for everything else (incl. 0)
function formatDurationPartsShort(parts) {
    var out = [];
    var unit = window.LANG === 'en' ? { m: 'mo', d: 'd' } : { m: 'міс', d: 'дн' };
    if (parts.years > 0)  { out.push(parts.years + ' ' + (window.LANG === 'en' ? 'y' : (parts.years === 1 ? 'р' : 'рр'))); }
    if (parts.months > 0) { out.push(parts.months + ' ' + unit.m); }
    if (parts.days > 0 || out.length === 0) { out.push(parts.days + ' ' + unit.d); }
    return out.join(', ');
}

//02.02f Decompose a raw day count into {years, months, days} by walking forward from a fixed epoch —
//used to sum several residence periods (which may span different, unrelated date ranges) into one duration
function decomposeDays(totalDays) {
    var epoch = new Date(2000, 0, 1);
    var end = new Date(epoch.getTime() + totalDays * 86400000);
    return dateDiffYMD(epoch, end);
}

//02.02e Join a list of names into a natural-language phrase: "A, B та C" / "A, B and C"
function joinWithAnd(items) {
    if (items.length === 0) { return ""; }
    if (items.length === 1) { return items[0]; }
    var andWord = (window.LANG === 'en') ? ' and ' : ' та ';
    return items.slice(0, -1).join(', ') + andWord + items[items.length - 1];
}

//02.02d Ukrainian noun pluralisation (1/2-4/5+ with the 11-14 exception) with an EN fallback; forms = [one, few, many]
function ukPluralWord(number, forms, enWord) {
    if (window.LANG === 'en') { return number + ' ' + enWord + (number == 1 ? '' : 's'); }
    var mod10 = number % 10, mod100 = number % 100;
    var word = (mod10 === 1 && mod100 !== 11) ? forms[0]
             : (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) ? forms[1]
             : forms[2];
    return number + ' ' + word;
}

//02.03 Get Visit date
function getVisitDate(start_date, end_date, year){
    var VisitDateToShow = "";
    var StartDay = start_date.getDate();
    var StartMonth = start_date.getMonth() + 1;
    var StartYear = "";
    var EndDay = end_date.getDate();
    var EndMonth = end_date.getMonth() + 1;
    var EndYear = "";

    if (year) {
        StartYear = start_date.getFullYear();
        EndYear = end_date.getFullYear();
    }

    if (StartDay == EndDay && StartMonth == EndMonth) {
        VisitDateToShow += StartDay + " " + getMonthName(StartMonth) + "." + EndYear + "; ";
    }
    else if (StartYear == EndYear) {
        VisitDateToShow = StartDay + " " + getMonthName(StartMonth) + " - " + EndDay + " " + getMonthName(EndMonth) + "." + EndYear + "; ";
    }
    else {VisitDateToShow = StartDay + " " + getMonthName(StartMonth) + "." + StartYear + " - " + EndDay + " " + getMonthName(EndMonth) + "." + EndYear + "; "}

    return VisitDateToShow;
}

//02.04 Sorting of objects in array by attribute
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var av = a[property], bv = b[property];
        // Strings (name_ua, name, name_full) → Ukrainian-aware order (і, ї, є, ґ in place);
        // dates/numbers keep the plain relational comparison.
        var result = (typeof av === "string" && typeof bv === "string")
            ? av.localeCompare(bv, window.LANG === 'en' ? 'en' : 'uk')
            : (av < bv) ? -1 : (av > bv) ? 1 : 0;
        return result * sortOrder;
    }
}

//02.05 Return correctly created string like "31 страна"
function parseWord (word, end1, end234, endrest, number){
    var endOfWord = endrest;
    //Returns last digit of number so then it's possible to create Ukrainian words correctly
    var newNumber = (number >20) ? number.toString()[number.toString().length-1]*1 : number;

    if (newNumber == 1){
        endOfWord = end1;
    }
    else if (newNumber == 2 || newNumber == 3 || newNumber == 4){
        endOfWord = end234;
    }
    return word + endOfWord;
}

//02.06 Shared helper: format a count with correct word form
function formatCount(number, bold, ukRoot, end1, end234, endRest, i18nKey) {
    var numStr = bold ? '<b>' + number + '</b>' : String(number);
    if (window.LANG === 'en') { return numStr + ' ' + t(i18nKey); }
    return numStr + ' ' + parseWord(ukRoot, end1, end234, endRest, number);
}
function setCountriesNumberWithCorrectEnd(number, bold) {
    return formatCount(number, bold, 'країн', 'а', 'и', '', 'countCountries');
}
function setLocationNumberWithCorrectEnd(number, bold) {
    return formatCount(number, bold, 'локаці', 'я', 'ї', 'й', 'countLocations');
}
function setRegionsNumberWithCorrectEnd(number) {
    return formatCount(number, false, 'регіон', '', 'а', 'ів', 'countRegions');
}
function setVisitsNumberWithCorrectEnd(number) {
    return formatCount(number, false, 'поїздк', 'а', 'и', 'ок', 'countTrips');
}

//02.09 Return month name in current language
function getMonthName (number) {
    if (window.LANG === 'en') {
        var en = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
        return en[number];
    }
    var monthSList = {1:"січня",2:"лютого",3:"березня",4:"квітня",5:"травня",6:"червня",7:"липня",8:"серпня",9:"вересня",10:"жовтня",11:"листопада",12:"грудня"};
    return monthSList[number];
}

//2.10 Get country name in current language
function getCountryName(countryId) {
    var result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });
    return result.length ? entityName(result[0]) : "";
}

//2.11 Get full country name in current language
function getFullUaCountryName(countryId) {
    var result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });
    return result.length ? result[0].setFullCountryName() : "";
}

//2.12 Get location name in current language
function getLocationName(locationId) {
    var result = $.grep (citiesVisited, function( n, i ) {
                return (n.city_id == locationId)
            });
    return result.length ? entityName(result[0]) : "";
}


//02.15b Story helpers. visit.story is one of:
//   boolean true  -> internal story; XML id is derived from date + country ids (legacy)
//   string (id)   -> internal story; explicit XML file id (e.g. "20061028romania")
//   string (URL)  -> external link
function isExternalStory(s) { return (typeof s === "string" && /^https?:\/\//i.test(s)); }
function getInternalStoryId(visit) {
    var ids = "", seen = {};
    $.each(visit.cities, function( i, city ){ if (!seen[city.country_id]) { ids += city.country_id; seen[city.country_id] = true; } });
    return "" + visit.start_date.getFullYear() + (visit.start_date.getMonth() + 1) + visit.start_date.getDate() + ids;
}
// internal XML id (derived or explicit) or null when it's an external URL / none
function getStoryRefId(visit) {
    if (visit.story === true) { return getInternalStoryId(visit); }
    if (typeof visit.story === "string" && visit.story !== "" && !isExternalStory(visit.story)) { return visit.story; }
    return null;
}
// external story URL (new story_url field, or a legacy URL stored in story) or null
function getExternalStoryUrl(visit) {
    if (visit.story_url) { return visit.story_url; }
    if (isExternalStory(visit.story)) { return visit.story; }
    return null;
}

//02.16 This method creates selector of stories
function getSelectorOfListOfStories_HTML(){
    var result = "";

    // Build id -> language map from preloaded stories index
    var langMap = {};
    $.each(window.__storiesIndex || [], function(i, s) {
        if (s && s.id) { langMap[s.id] = s.language || "UA"; }
    });

    $.each (visitsSorted, function( i, visit ){
        var countriesToReturn = "";
        var countriesIDToReturn = "";
        var distinctIds = {};

        var sid = getStoryRefId(visit);
        var ext = getExternalStoryUrl(visit);
        if (sid !== null || ext) {
            $.each (visit.cities, function( i, city ){
                if (!distinctIds[city.country_id]){
                 countriesToReturn += getCountryName(city.country_id) + ", ";
                 countriesIDToReturn += city.country_id;
                 distinctIds[city.country_id] = true;
                }
            });
            var text = (countriesToReturn.length > 27) ? countriesToReturn.slice(0, 25) + "..." : countriesToReturn.slice(0, -2);
            var dateText = getVisitDate(visit.start_date, visit.end_date, "year").slice(0, -2);

            if (sid !== null) {
                var lang = langMap[sid] || "UA";
                var badge = "<span class='story-lang-badge story-lang-badge-" + lang.toLowerCase() + "'>" + lang + "</span>";
                result += "<li><a id='" + sid + "' onmouseover='' style='cursor: pointer;' onclick='javascript:getStoryPage(this.id)'>" + dateText + " -  " + text + " " + badge + "</a></li>";
                // Append EN variant if it exists in the index
                var enId = sid + "_en";
                if (langMap[enId]) {
                    var enLang = langMap[enId];
                    var enBadge = "<span class='story-lang-badge story-lang-badge-" + enLang.toLowerCase() + "'>" + enLang + "</span>";
                    result += "<li><a id='" + enId + "' onmouseover='' style='cursor: pointer;' onclick='javascript:getStoryPage(this.id)'>" + dateText + " -  " + text + " " + enBadge + "</a></li>";
                }
            }
            if (ext) {
                result += "<li><a href='" + ext + "' target='_blank'>" + dateText + " -  " + text + " ↗</a></li>";
            }
        }
    });

    return result;
}

//02.17 Calculate number of locations visited
function getNumberOfLocation() {
    $.each(initial_data.continent, function( i, cont ){
        var numberOfCities = 0;

        $.each( countriesVisited, function( j, country ){
            if (country.continent_id == cont.continent_id || country.continent_id2 == cont.continent_id) {
                
                var countryElem = $("a#" + country.short_name + "[continent_id='" + cont.continent_id + "']").last().get(0);

                var numberOfVisitedCities = country.getNumberOfVisitedCities(cont.continent_id);
                if (countryElem) {
                    countryElem.firstElementChild.setAttribute("title", country.setFullCountryName() + " - " + setLocationNumberWithCorrectEnd(numberOfVisitedCities));
                }
                numberOfCities = numberOfCities + numberOfVisitedCities;
            }
        });

        document.getElementById("citiesNumberPerContinent" + cont.continent_id).innerHTML = " · " + setLocationNumberWithCorrectEnd(numberOfCities, true);
    });
    document.getElementById("totalCitiesNum").innerHTML = " · " + setLocationNumberWithCorrectEnd(citiesVisited.length, true);
}

//2.17b Load the shared settings helper (set_content.js) once, then run the callback.
// Avoids re-fetching/re-evaluating the file on every add/edit/remove operation.
function withSetContent(callback) {
    if (window.__setContentLoaded) { callback(); return; }
    $.getScript("SCRIPTS/set_content.js?v=" + APP_V, function () { window.__setContentLoaded = true; callback(); })
        .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load set_content.js. Reload and try again.</div>'; });
}

//2.18 Remove all attributes by name
function removeAllAttributesByName(attrType, attrName, excludeSelector) {
    // getElementsByClassName returns a LIVE collection — snapshot it before modifying.
    var mylist = document.getElementsByClassName(attrName);
    var snapshot = Array.prototype.slice.call(mylist);
    for (var j = 0; j < snapshot.length; j++) {
        if (excludeSelector && snapshot[j].closest && snapshot[j].closest(excludeSelector)) { continue; }
        snapshot[j].removeAttribute(attrType);
    }
}

//2.19 Remove all child nodes
function removeAllChildNodes(attrId) {
    var list = document.getElementById(attrId);

    if (list == null) return;

    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    };
}

//2.20 Remove element from Array
function removeElementOfGlobalDataArray (arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){
           arr.splice(i,1);
       }
    }
}

//2.22 Reprocess all custom arrays and refresh scrolles
function refreshAllTheArrays (){
    //Reprocess all custom arrays
    processMyJson(data);
    //Creation of Story Selector
    document.getElementById("ContentBody_StoryList").innerHTML = getSelectorOfListOfStories_HTML();
}

//2.23 Get country id instead of short name
function getCountryId(short_name) {
    var result = $.grep (data.country, function( n, i ) {
                return (n.short_name == short_name)
            });
    return result.length ? result[0].country_id : "";
}

//2.24 On page open: highlight the active navbar section and scroll back to the top
function setActiveNav (navId) {
    $(".navbar-nav > li").removeClass("active");
    if (navId) { $("#" + navId).addClass("active"); }
    window.scrollTo(0, 0);
}

//2.24a Return the Ukrainian name of a country's type (recognized / partially recognized / …)
function getCountryTypeName (typeId) {
    if (typeof data === "undefined" || !data.country_type) { return ""; }
    for (var i = 0; i < data.country_type.length; i++) {
        if (data.country_type[i].country_type_id == typeId) { return entityName(data.country_type[i]); }
    }
    return "";
}

//2.24b Status colour icon for a country type: green / yellow / red / blue
function getCountryTypeIcon (typeId) {
    var icons = { "1": "🟢", "2": "🟡", "3": "🔴", "4": "🔵" };
    return icons[typeId] || "";
}

//2.25 Navbar live search over visited countries and cities (matches UA name_ua + EN name)
function navSearch (query) {
    var box = document.getElementById("navSearchResults");
    if (!box) { return; }
    var q = (query || "").trim().toLowerCase();
    if (q === "") {
        box.innerHTML = ""; box.classList.remove("show"); return;
    }

    var html = "", count = 0, CAP = 40;
    var hit = function (o) {
        return (o.name_ua && o.name_ua.toLowerCase().indexOf(q) !== -1) ||
               (o.name && o.name.toLowerCase().indexOf(q) !== -1);
    };
    var row = function (label, type, id) {
        html += "<li><a onclick=\"javascript:navSearchGo('" + type + "','" + id + "')\" style='cursor:pointer'>" +
                "<span>" + label + "</span><span class='ns-type'>" + (type === "country" ? t('typeCountry') : t('typeLocation')) + "</span></a></li>";
        count++;
    };

    $.each(countriesVisited, function (i, c) {
        if (count >= CAP) { return false; }
        if (hit(c)) { row(entityName(c), "country", c.short_name); }
    });
    $.each(citiesVisited, function (i, city) {
        if (count >= CAP) { return false; }
        if (hit(city)) { row(entityName(city), "city", city.city_id); }
    });

    box.innerHTML = html;
    box.classList.toggle("show", html !== "");
}

//2.26 Navigate to a search result and reset the search box
function navSearchGo (type, id) {
    var input = document.getElementById("navSearch"); if (input) { input.value = ""; }
    var box = document.getElementById("navSearchResults"); if (box) { box.innerHTML = ""; box.classList.remove("show"); }
    if (type === "country") { getCountryPage(id); } else { getCityPage(id); }
}

//2.27 Keyboard navigation for the search dropdown: Up/Down move, Enter selects, Esc closes
function navSearchKey (e) {
    var box = document.getElementById("navSearchResults");
    if (!box || !box.classList.contains("show")) { return; }
    var items = box.getElementsByTagName("a");
    if (!items.length) { return; }

    var idx = -1, i;
    for (i = 0; i < items.length; i++) { if (items[i].classList.contains("ns-active")) { idx = i; break; } }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        idx = (idx + 1) % items.length;
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        idx = (idx <= 0) ? items.length - 1 : idx - 1;
    } else if (e.key === "Enter") {
        e.preventDefault();
        (idx >= 0 ? items[idx] : items[0]).click();
        return;
    } else if (e.key === "Escape") {
        box.classList.remove("show");
        return;
    } else {
        return;
    }

    for (i = 0; i < items.length; i++) {
        if (i === idx) { items[i].classList.add("ns-active"); items[i].scrollIntoView({ block: "nearest" }); }
        else { items[i].classList.remove("ns-active"); }
    }
}

//03.00 Basic functions
//Here are page objects that used for each page shown

//03.01 Creator of the About / Contacts page
function HTML_CreatorOfAboutPage () {
    setActiveNav();
    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?page=about"); }
    setPageMeta(t('about'), "index.html?page=about");
    document.getElementById("mainSection").innerHTML =
        "<div class='about-page'>" +
            "<header class='about-hero'>" +
                "<img class='about-logo' src='IMG/icon/logo-about.png' alt='" + t('brandName') + "' loading='lazy' decoding='async' />" +
                "<h1>" + t('brandName') + "</h1>" +
                "<p class='about-tagline'>" + t('aboutTagline') + "</p>" +
            "</header>" +
            "<section class='about-card'>" +
                "<p>" + t('aboutP1') + "</p>" +
                "<p>" + t('aboutP2') + "</p>" +
                "<p class='about-signature'>" + t('aboutSignature') + "</p>" +
            "</section>" +
            "<h2 class='about-h2'>" + t('aboutContacts') + "</h2>" +
            "<div class='contact-grid'>" +
                "<a class='contact-card' href='mailto:coatls77@gmail.com'><span class='contact-ico'>✉️</span><span class='contact-meta'><span class='contact-label'>Email</span><span class='contact-val'>coatls77@gmail.com</span></span></a>" +
                "<div class='contact-card'><span class='contact-ico'>📍</span><span class='contact-meta'><span class='contact-label'>" + t('aboutLocationLabel') + "</span><span class='contact-val'>Kyiv, Ukraine</span></span></div>" +
                "<a class='contact-card' href='https://www.linkedin.com/in/oleksiyslavutskyy/' target='_blank' rel='noopener'><span class='contact-ico'>in</span><span class='contact-meta'><span class='contact-label'>LinkedIn</span><span class='contact-val'>oleksiyslavutskyy</span></span></a>" +
            "</div>" +
            "<footer class='about-tech'>" +
                "<span class='tech-tag'>v9.4.0</span>" +
                "<span class='tech-tag'>HTML</span>" +
                "<span class='tech-tag'>CSS</span>" +
                "<span class='tech-tag'>JavaScript</span>" +
                "<span class='tech-tag'>jQuery</span>" +
                "<span class='tech-tag'>JSON / XML</span>" +
                "<a class='tech-tag' href='http://www.amcharts.com/javascript-maps/' target='_blank'>amMap</a>" +
                "<a class='tech-tag' href='http://getbootstrap.com/' target='_blank'>Bootstrap</a>" +
            "</footer>" +
        "</div>";
}

//03.03 // When the user scrolls down 20px from the top of the document, show the button
    function updateBackToTopVisibility() {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            document.getElementById("back").style.display = "block";
        } else {
            document.getElementById("back").style.display = "none";
        }
    }

