//03. World page
//03.01 Creator of page
function createWorldPage_HTML () {
    //Creation of Country Selector
    //document.getElementById("ContentBody_CountryList").innerHTML = HTML_SelectorListOfCountries();
    //Creation of City Selector
    //document.getElementById("ContentBody_CityList").innerHTML = HTML_SelectorListOfCities();
	//Creation of Story Selector
    //document.getElementById("ContentBody_StoryList").innerHTML = HTML_SelectorListOfStories();

    //Add script for map creation
    $('<script src="SCRIPTS/MAPS/worldLow.js" type="text/javascript"></script>').appendTo("body");

    document.getElementById("someElement").innerHTML = "<div id='mapdiv' class='map'></div>" +
        "<div id='countryToVisitSelector'>" +
		"<div class='switchlink_l float_l'>Мои страны...</div>" +
        "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
        "<br><br>" +
        "<div class='clear' />" + createWorldPageFrontView() + "</div>";

    CreateMap("none");
}

//03.02 This method creates hidden list of countries which will be used to create JS world map
function createWorldMap_HTML() {
    //EXAMPLE: <div id="countryList" style="display:none;">world,ABH,AD,AE,</div><div id="cityList" style="display:none;">world;</div></div>
    var result = "<div id='countryList' style='display:none;'>world,";
    for (var i = 0; i < countriesVisited.length; i++) {
        result += countriesVisited[i].country_id + ",";
    }
    result += "</div><div id='cityList' style='display:none;'>world;</div></div>";
    return result;
}

//03.03 This method creates content for World page
function createWorldPageFrontView() {
    var result = "<div id='MainContainer'>";

    //List of visited countries splited per continents
    for (var i = 0; i < data.continent.length; i++) {
        if (undefined != data.continent[i].name_ru) {
            var countriesPerContinentNumber = 0;
            var citiesPerContryNumber = 0;
            var listOfCountries = "";

            for (var j = 0; j < countriesVisited.length; j++) {
                if (countriesVisited[j].continent_id == data.continent[i].continent_id) {
                    countriesPerContinentNumber += 1;
                    citiesPerContryNumber += countriesVisited[j].getNumberOfVisitedCities();
                    listOfCountries += "<a id='" + countriesVisited[j].short_name +
                    "' title='Перейти к информации о стране' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'><img src='IMG/flag_n_emblem/small_flags/" +
					countriesVisited[j].short_name + ".png' title='" + countriesVisited[j].setFullCountryName() + " - " +
                    setLocationNumberWithCorrectEnd(countriesVisited[j].getNumberOfVisitedCities()) + "' class='countflag' /></a>"
                }
            }
            if (countriesPerContinentNumber > 0) {
                result += "<div class='my_countries'><div><b>" + data.continent[i].name_ru + ":</b> " + setCountriesNumberWithCorrectEnd(countriesPerContinentNumber) + " (" + setLocationNumberWithCorrectEnd(citiesPerContryNumber) + ")</div>" + listOfCountries + "</div>";
            }
        }
    }
    result += createWorldMap_HTML();
    result += "<div class='countryhead'>Всего: " + setCountriesNumberWithCorrectEnd(countriesVisited.length) + " (" + setLocationNumberWithCorrectEnd(citiesVisited.length) + ")</div></div>";
    return result;
}

//03.04 This method creates list of worlds visits
function createWorldPageListOfAllVisits() {
    //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
    //         <div class="secondcell float_l"><a href="countries.aspx?country=poland" id="25,52,19.5;Katowice,50.2599736,19.0284561;Wroclaw,51.122489,17.026062;Swidnica,50.8403152,16.4935923;Ksiaz,50.8440566,16.2897844;Opole,50.6780534,17.9175784;" onmouseover="CreateMap(this.id)" onmouseout="CreateMap('none')">Катовице, Вроцлав, Свидница, Кщёнж, Ополе (Польша)</a></div>
    //         <br class="clear">
    var result = "";

    for (var a = 0; a < visitsSorted.length; a++) {
        //This section sets year
        result += "<div class='visityear clear'>" + visitsSorted[a].start_date.getFullYear() + "</div>";

        //This section is responsible to create date section
        //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
        if (visitsSorted[a].start_date.toDateString() == visitsSorted[a].end_date.toDateString()) {
            result += "<div class='firstcell float_l'>" + visitsSorted[a].start_date.getDate() + " " +
                      getRusMonthName(visitsSorted[a].start_date.getMonth()) + "</div>"
        }
        else {
            result += "<div class='firstcell float_l'>" + visitsSorted[a].start_date.getDate() + " " + getRusMonthName(visitsSorted[a].start_date.getMonth()) + " - " +
                      visitsSorted[a].end_date.getDate() + " " + getRusMonthName(visitsSorted[a].end_date.getMonth()) + "</div>"
        }

        //This section is responsible for displaying list of visited cities and countries
        var citiesLink = "";
        var countryLink = "";
        var distinctIds = {};
        for (var b = 0; b < visitsSorted[a].cities.length; b++) {
            for (var c = 0; c < citiesVisited.length; c++) {
                if (citiesVisited[c].city_id == visitsSorted[a].cities[b]) {
                    citiesLink += "<a id='" + visitsSorted[a].cities[b] + "' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                  getRusLocationName(citiesVisited[c].name_ru) + "</a>" + ", ";

                    for (var d = 0; d < regionsVisited.length; d++){
                        if (regionsVisited[d].region_id == citiesVisited[c].region_id && !distinctIds[regionsVisited[d].country_id]){
                            countryLink += "<a id='" + regionsVisited[d].country_id + "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                            getRusCountryName(regionsVisited[d].country_id) + "</a>" + ", ";
                            distinctIds[regionsVisited[d].country_id] = true;
                        }
                        break;
                    }
                    break;
                }
            }
        }

        result += "<div class='secondcell float_l'>" + citiesLink.slice(0, -2) + " (" + countryLink.slice(0, -2) + " )</div>";
        //Can be added to display a city on the map: onmouseover='CreateMap(this.id)' onmouseout=\"CreateMap('none')\"
        //"' id='" + zoomLat + "," + zoomLong + "," + zoomLvl + ";" + citiesCoordinates +
        result += "<br class='clear'>";
    }
    return result;
}

//03.05 World page with list of Visits
function OpenListOfWorldVisits() {
    var result = "<div class='switchlink_l float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldCountries()' onmouseover='' style='cursor: pointer;'>Мои страны</a></div>" +
        "<div class='switchlink float_l'>Мои визиты...</div>" +
        "<br><br>" + createWorldPageListOfAllVisits();
    document.getElementById("countryToVisitSelector").innerHTML = result;
}

//03.06 World page with list of Visits
function OpenListOfWorldCountries() {
    var result = "<div class='switchlink_l float_l'>Мои страны...</div>" +
        "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
        "<br><br>" + createWorldPageFrontView();
    document.getElementById("countryToVisitSelector").innerHTML = result;
}