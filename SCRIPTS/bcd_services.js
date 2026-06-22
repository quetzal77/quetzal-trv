//02.00 Services
//This file contains all the functions shared among all the other functions, so we can't use them for any another one function's file

//02.01 Create new AMMAP's map
function drawMap(){
    var url = (local[1].map_img != undefined) ? local[1].map_img : "worldLow.js" ;
    $.getScript("SCRIPTS/MAPS/ammap.js", function() {
        $.getScript("SCRIPTS/MAPS/custommap.js", function() {
            $.getScript("SCRIPTS/MAPS/" + url, function() {
                $('#mapdiv').removeClass('loading');
                $('#mapdiv').addClass('map');
                CreateMap();
            });
        });
    });
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
                                           getUaLocationName(city.city_id) + "</a>" + ", "
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
                                      getUaLocationName(city.city_id) + "</a>" + ", ";
                     if (!distinctIds[city.country_id]){
                         countriesToReturn += "<a id='" + city.country_id + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                      getUaCountryName(city.country_id) + "</a>" + ", ";
                         distinctIds[city.country_id] = true;
                     }
                 });
                 result += "<div class='visitrow'>" + VisitDate + "<div class='secondcell'>" + citiesToReturn.slice(0, -2) + " (" + countriesToReturn.slice(0, -2) + ")</div></div>";
                 VisitYear_HTML = "";
         }
     });
     return result;
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
        VisitDateToShow += StartDay + " " + getUaMonthName(StartMonth) + "." + EndYear + "; ";
    }
    else if (StartYear == EndYear) {
        VisitDateToShow = StartDay + " " + getUaMonthName(StartMonth) + " - " + EndDay + " " + getUaMonthName(EndMonth) + "." + EndYear + "; ";
    }
    else {VisitDateToShow = StartDay + " " + getUaMonthName(StartMonth) + "." + StartYear + " - " + EndDay + " " + getUaMonthName(EndMonth) + "." + EndYear + "; "}

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
            ? av.localeCompare(bv, 'uk')
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

//02.06 Return Ukrainian word "country" with correct end
function setCountriesNumberWithCorrectEnd (number, bold) {
    var wordBody = "країн";
    var end1 = "а";
    var end234 = "и";
    var endrest = "";
    return (bold ? "<b>" + number + "</b>" : number) + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.07 Return Ukrainian word "location" with correct end
function setLocationNumberWithCorrectEnd (number, bold) {
    var wordBody = "локаці";
    var end1 = "я";
    var end234 = "ї";
    var endrest = "й";
    return (bold ? "<b>" + number + "</b>" : number) + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.08 Return Ukrainian word "region" with correct end
function setRegionsNumberWithCorrectEnd (number) {
    var word = "регіон";
    var end1 = "";
    var end234 = "а";
    var endrest = "ів";
    return number + " " + parseWord  (word, end1, end234, endrest, number);
}

//02.08a Return Ukrainian word "visit" with correct end
function setVisitsNumberWithCorrectEnd (number) {
    var word = "поїздк";
    var end1 = "а";
    var end234 = "и";
    var endrest = "ок";
    return number + " " + parseWord (word, end1, end234, endrest, number);
}

//02.09 Return Ukrainian month name
function getUaMonthName (number) {
    var monthSList = {1: "січня", 2: "лютого", 3: "березня", 4: "квітня", 5: "травня", 6: "червня", 7: "липня", 8: "серпня", 9: "вересня", 10: "жовтня", 11: "листопада", 12: "грудня"};
    return monthSList[number];
}

//2.10 Get Ukrainian country name
function getUaCountryName(countryId) {
    var result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });
    return result.length ? result[0].name_ua : "";
}

//2.11 Get full Ukrainian country name
function getFullUaCountryName(countryId) {
    var result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });

    if (!result.length) { return ""; }
    if (result[0].name_nt == "" || result[0].name_nt == undefined) {
        result = result[0].name_ua + " - " + result[0].name;
    }
    else if (result[0].name_ua == "" || result[0].name_ua == undefined) {
        result = result[0].name_nt + " - " + result[0].name;
    }
    else if (result[0].name == "" || result[0].name == undefined) {
        result = result[0].name_ua + " - " + result[0].name_nt;
    }
    else {
        result = result[0].name_ua + " - " + result[0].name_nt + " - " + result[0].name;
    }

    return result;
}

//2.12 Get Ukrainian Location name
function getUaLocationName(locationId) {
    var result = $.grep (citiesVisited, function( n, i ) {
                return (n.city_id == locationId)
            });
    return result.length ? result[0].name_ua : "";
}

//2.13 Get english Location name
function getEngLocationName(locationId) {
    var result = $.grep (citiesVisited, function( n, i ) {
                return (n.city_id == locationId)
            });
    return result.length ? result[0].name : "";
}

//02.16 This method creates selector of stories
function getSelectorOfListOfStories_HTML(){
    var result = "";

    $.each (visitsSorted, function( i, visit ){
        var countriesToReturn = "";
        var countriesIDToReturn = "";
        var distinctIds = {};

        if (visit.story != "" && visit.story != null && visit.story != undefined){
            $.each (visit.cities, function( i, city ){
                if (!distinctIds[city.country_id]){
                 countriesToReturn += getUaCountryName(city.country_id) + ", ";
                 countriesIDToReturn += city.country_id;
                 distinctIds[city.country_id] = true;
                }
            });
            var StartMonth = visit.start_date.getMonth() + 1;

            var url = (visit.story == true) ? "id='" + visit.start_date.getFullYear() + StartMonth + visit.start_date.getDate() + countriesIDToReturn + "' onmouseover='' style='cursor: pointer;' onclick='javascript:getStoryPage(this.id)'"
                                            : "href='" + visit.story + "' target='_blank'";
            var text = (countriesToReturn.length > 27) ? countriesToReturn.slice(0, 25) + "..." : countriesToReturn.slice(0, -2);

            result += "<li><a " + url + ">" + getVisitDate(visit.start_date, visit.end_date, "year").slice(0, -2) + " - " + " " + text + "</a></li>";
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
    $.getScript("SCRIPTS/set_content.js", function () { window.__setContentLoaded = true; callback(); });
}

//2.18 Remove all attributes by name
function removeAllAttributesByName(attrType, attrName) {
    // getElementsByClassName returns a LIVE collection: removing the class mid-loop
    // shrinks it and makes the loop skip elements, leaving stale "active" markers
    // (e.g. the previous left-menu item stayed highlighted). Snapshot it first.
    var mylist = document.getElementsByClassName(attrName);
    var snapshot = Array.prototype.slice.call(mylist);
    for (var j = 0; j < snapshot.length; j++) {
        // keep the top navbar highlight (e.g. "Налаштування") — it is managed by setActiveNav,
        // not by the settings sidebar that this clear is meant for
        if (snapshot[j].closest && snapshot[j].closest(".navbar-nav")) { continue; }
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

//2.20 Remove readonly attribute from Input field
function unblockReadonlyField(id){
    $("#" + id).removeAttr("readonly");
}

//2.21 Remove element from Array
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
        if (data.country_type[i].country_type_id == typeId) { return data.country_type[i].name_ua; }
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
    if (q === "" || typeof countriesVisited === "undefined" || typeof citiesVisited === "undefined") {
        box.innerHTML = ""; box.classList.remove("show"); return;
    }

    var html = "", count = 0, CAP = 40;
    var hit = function (o) {
        return (o.name_ua && o.name_ua.toLowerCase().indexOf(q) !== -1) ||
               (o.name && o.name.toLowerCase().indexOf(q) !== -1);
    };
    var row = function (label, type, id) {
        html += "<li><a onclick=\"javascript:navSearchGo('" + type + "','" + id + "')\" style='cursor:pointer'>" +
                "<span>" + label + "</span><span class='ns-type'>" + (type === "country" ? "країна" : "локація") + "</span></a></li>";
        count++;
    };

    $.each(countriesVisited, function (i, c) {
        if (count >= CAP) { return false; }
        if (hit(c)) { row(c.name_ua, "country", c.short_name); }
    });
    $.each(citiesVisited, function (i, city) {
        if (count >= CAP) { return false; }
        if (hit(city)) { row(city.name_ua, "city", city.city_id); }
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
    setPageMeta("Про проект", "index.html?page=about");
    document.getElementById("mainSection").innerHTML =
        "<div class='about-page'>" +
            "<header class='about-hero'>" +
                "<img class='about-logo' src='IMG/icon/logo-about.png' alt='Будинок пернатого равлика' loading='lazy' decoding='async' />" +
                "<h1>Будинок пернатого равлика</h1>" +
                "<p class='about-tagline'>Особистий сайт про мої подорожі — країни, локації, фото та звіти.</p>" +
            "</header>" +
            "<section class='about-card'>" +
                "<p>Вітаю. Моє ім'я Олексій Славутський і це мій особистий сайт. Існує безліч таких сайтів, але цей — мій! " +
                "Тут зібрано всю інформацію про мої подорожі: фотографії, звіти про поїздки, список відвіданих територій та багато іншого про моє захоплення туризмом.</p>" +
                "<p>Вся інформація на сайті — результат моєї багаторічної роботи та поїздок. Спочатку це був просто список країн у файлі Word, який згодом, завдяки захопленню інтернетом і супутніми технологіями, перетворився на те, що ви бачите перед собою. Не знаю, куди заведе мене ця дорога, але радий це з'ясувати.</p>" +
                "<p class='about-signature'>Приємного перегляду!</p>" +
            "</section>" +
            "<h2 class='about-h2'>Контакти</h2>" +
            "<div class='contact-grid'>" +
                "<a class='contact-card' href='mailto:coatls77@gmail.com'><span class='contact-ico'>✉️</span><span class='contact-meta'><span class='contact-label'>Email</span><span class='contact-val'>coatls77@gmail.com</span></span></a>" +
                "<div class='contact-card'><span class='contact-ico'>📍</span><span class='contact-meta'><span class='contact-label'>Локація</span><span class='contact-val'>Київ, Україна</span></span></div>" +
                "<a class='contact-card' href='https://www.linkedin.com/in/oleksiyslavutskyy/' target='_blank' rel='noopener'><span class='contact-ico'>in</span><span class='contact-meta'><span class='contact-label'>LinkedIn</span><span class='contact-val'>oleksiyslavutskyy</span></span></a>" +
            "</div>" +
            "<footer class='about-tech'>" +
                "<span class='tech-tag'>v9.1.13 (ukr)</span>" +
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
    function scrollFunction() {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            document.getElementById("back").style.display = "block";
        } else {
            document.getElementById("back").style.display = "none";
        }
    }

