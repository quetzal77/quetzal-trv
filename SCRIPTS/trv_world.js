//04. World page
//Scripts for creation of World page

//04.01 Creator of page
function createWorldPage_HTML (continents, countries, callback) {
    //Add script for map creation
    document.getElementById("mainSection").innerHTML =
        "<div id='mapdiv' class='map' style='background: url(img/loading.gif) no-repeat center;'>&nbsp;</div>" +
        "<div id='countryToVisitSelector'>" +
		    "<div class='switchlink_l float_l'>Мои страны...</div>" +
            "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
            "<br><br>" +
            "<div class='clear' />" + createWorldPageFrontView(continents, countries) + "</div>";

    callback();
}

//04.02 This method creates content for World page
function createWorldPageFrontView(countinents, countries) {
    var result = "<div id='MainContainer'>";

    //List of visited countries splited per continents
    $.each( countinents, function( i, cont ){
        var countriesPerContinentNumber = 0;
        var listOfCountries = "";

        $.each( countries, function( j, country ){
            if (country.continent_id == cont.continent_id) {
                countriesPerContinentNumber += 1;
                listOfCountries += "<a id='" + country.country_id +
                "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'><img src='IMG/flag_n_emblem/small_flags/" +
                country.country_id + ".png' title='" + country.name_full + "' class='countflag' /></a>"
            }
        });
        result += "<div class='my_countries'><div><b>" + cont.name_ru + ":</b> " + setCountriesNumberWithCorrectEnd(countriesPerContinentNumber) +
                  "</div>" + listOfCountries + "</div>";
    });
    result += createWorldMap_HTML(countries);
    result += "<div class='countryhead'>Всего: " + setCountriesNumberWithCorrectEnd(countries.length) + "</div></div>";
    return result;
}

//04.03 This method creates hidden list of countries which will be used to create JS world map
function createWorldMap_HTML(countries) {
    //EXAMPLE: <div id="countryList" style="display:none;">world,ABH,AD,AE,</div><div id="cityList" style="display:none;">world;</div></div>
    var result = "<div id='countryList' style='display:none;'>world,";
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
        "<br><br>" + createWorldPageListOfAllVisits();
}

//04.05 World page with list of Visits
function OpenListOfWorldCountries() {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l float_l'>Мои страны...</div>" +
        "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
        "<br><br>" + createWorldPageFrontView();
}