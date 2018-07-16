//04. World page
//Scripts for creation of World page

//04.01 Creator of page
function createWorldPage_HTML () {
    // Set global variable with type of map to be opened
    local = [];
    local.push("world", "none");

    // Set url
    window.history.pushState("object or string", "Title", "index.html");

    //Add script for map creation
    document.getElementById("mainSection").innerHTML =
        "<div id='mapdiv' class='map loading'>&nbsp;</div>" +
        "<div id='countryToVisitSelector'>" +
		    "<div class='switchlink_l float_l'>Мои страны...</div>" +
            "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
            "<br><br>" +
            "<div class='clear' />" + createWorldPageFrontView() + "</div>";

    //Creation of world map
    drawMap();

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-2017, Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//04.02 This method creates content for World page
function createWorldPageFrontView() {
    var countinents = initial_data.continent
    var countries = initial_data.country
    var result = "<div id='MainContainer'>";

    //List of visited countries splited per continents
    $.each( countinents, function( i, cont ){
        var countriesPerContinentNumber = 0;
        var listOfCountries = "";

        $.each( countries, function( j, country ){
            if (country.continent_id == cont.continent_id) {
                countriesPerContinentNumber += 1;

                listOfCountries += "<a id='" + country.short_name + "' title='Перейти к информации о стране' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
//                "<a href='index.html?country=" + country.short_name + "' onmouseover='' style='cursor: pointer;'>" +
                "<img src='IMG/icon/x.gif' title='" + country.name_full + "' class='countflag' style='background-position:" + country.small_flag_img + "' /></a>"
            }
        });
        result += "<div class='my_countries'><div><b>" + cont.name_ru + ":</b> " + setCountriesNumberWithCorrectEnd(countriesPerContinentNumber) + "<span id='citiesNumberPerContinent" + cont.continent_id + "'></span>" +
                  "</div>" + listOfCountries + "</div>";
    });
    result += createWorldMap_HTML(countries);
    result += "<div class='countryhead'>Всего: " + setCountriesNumberWithCorrectEnd(countries.length) + "<span id='totalCitiesNum'></span></div></div>";
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
        "<div class='switchlink_l float_l'><a title='Перейти к списку стран' onclick='javascript:OpenListOfWorldCountries()' onmouseover='' style='cursor: pointer;'>Мои страны</a></div>" +
        "<div class='switchlink float_l'>Мои визиты...</div>" +
        "<br><br>" + createListOfVisites();
}

//04.05 World page with list of Countries
function OpenListOfWorldCountries() {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l float_l'>Мои страны...</div>" +
        "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
        "<br><br>" + createWorldPageFrontView();
        
     //Calculate number of location visited and add them to front page
     if (local[0] == "world"){
        getNumberOfLocation();
     }
    }