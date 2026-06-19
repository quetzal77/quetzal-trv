//04. World page
//Scripts for creation of World page

//04.01 Creator of page
function createWorldPage_HTML () {
    // Set global variable with type of map to be opened
    local = [];
    local.push("world", "none");

    // Set url
    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html"); }
    setPageMeta("", "");

    //Add script for map creation
    document.getElementById("mainSection").innerHTML =
        "<div id='mapdiv' class='map loading'>&nbsp;</div>" +
        "<div id='countryToVisitSelector'>" +
		    "<div class='switchlink_l'>Мої країни...</div>" +
            "<div class='switchlink'><a title='Перейти до списку візитів' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мої візити</a></div>" +
            "<span class='totalstat'>Усього: " + setCountriesNumberWithCorrectEnd(initial_data.country.length, true) + "<span id='totalCitiesNum'></span></span>" +
            createWorldPageFrontView() + "</div>";

    //Creation of world map
    drawMap();

    //Highlight the active section in the navbar
    setActiveNav("navHome");

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-" + new Date().getFullYear() + ", Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

// Total number of countries per continent (world reference — edit freely)
var continentTotalCountries = {EU:53, AS:48, AF:54, NA:23, AO:14, SA:12, CA:20, AN:0};

//04.02 This method creates content for World page
function createWorldPageFrontView() {
    var continents = initial_data.continent;
    var countries = initial_data.country;
    var result = "<div id='MainContainer'>";

    //List of visited countries splited per continents
    $.each( continents, function( i, cont ){
        var countriesPerContinentNumber = 0;
        var listOfCountries = "";

        $.each( countries, function( j, country ){
            if (country.continent_id == cont.continent_id || country.continent_id2 == cont.continent_id) {
                countriesPerContinentNumber += 1;

                listOfCountries += "<a id='" + country.short_name + "' continent_id='" + cont.continent_id + "' title='Перейти до інформації про країну' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                "<img src='IMG/icon/x.gif' title='" + country.name_full + "' class='countflag' style='background-position:" + country.small_flag_img + "' /></a>";
            }
        });
        var totalCountries = continentTotalCountries[cont.continent_id];
        var countriesHtml = (totalCountries > 0)
            ? "<b>" + countriesPerContinentNumber + "</b> з <b>" + totalCountries + "</b> країн"
            : setCountriesNumberWithCorrectEnd(countriesPerContinentNumber, true);
        var progressHtml = (totalCountries > 0)
            ? "<div class='cont-progress'><span style='width:" + Math.min(100, Math.round(countriesPerContinentNumber / totalCountries * 100)) + "%'></span></div>"
            : "";
        result += "<div class='my_countries'><div><b>" + cont.name_ua + ":</b> " + countriesHtml + progressHtml + "<span id='citiesNumberPerContinent" + cont.continent_id + "'></span>" +
                  "</div>" + listOfCountries + "</div>";
    });
    result += createWorldMap_HTML(countries);
    return result;
}

//04.03 This method creates hidden list of countries which will be used to create JS world map
function createWorldMap_HTML(countries) {
    //EXAMPLE: <div id="countryList" style="display:none;">world,ABH,AD,AE,</div><div id="cityList" style="display:none;">world;</div></div>
    var result = "<div id='countryList' style='display:none;'>worldLow,";
    $.each( countries, function( i, val ){
        result += val.country_id + ",";
    });
    result += "</div><div id='cityList' style='display:none;'>world;</div></div>";
    return result;
}

//04.04 World page with list of Visits
function OpenListOfWorldVisits() {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l'><a title='Перейти до списку країн' onclick='javascript:OpenListOfWorldCountries()' onmouseover='' style='cursor: pointer;'>Мої країни</a></div>" +
        "<div class='switchlink'>Мої візити...</div>" +
        createListOfVisites();
}

//04.05 World page with list of Countries
function OpenListOfWorldCountries() {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l'>Мої країни...</div>" +
        "<div class='switchlink'><a title='Перейти до списку візитів' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мої візити</a></div>" +
        "<span class='totalstat'>Усього: " + setCountriesNumberWithCorrectEnd(initial_data.country.length, true) + "<span id='totalCitiesNum'></span></span>" +
        createWorldPageFrontView();

     //Calculate number of location visited and add them to front page
     if (local[0] == "world"){
        getNumberOfLocation();
     }
    }