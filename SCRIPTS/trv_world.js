//03. World page
//03.01 Creator of page
function HTML_CreatorOfWorldPage() {
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
        "<div class='clear' />" + HTMLListOfCountries() + "</div>";

    CreateMap("none");
}

//03.02 This method creates hidden list of countries which will ne used to create JS world map
function HTMLHiddenWorldMapCreator() {
    //EXAMPLE: <div id="countryList" style="display:none;">world,ABH,AD,AE,</div><div id="cityList" style="display:none;">world;</div></div>
    var result = "<div id='countryList' style='display:none;'>world,";
    for (var i = 0; i < countriesVisited.length; i++) {
        result += countriesVisited[i].country_id + ",";
    }
    result += "</div><div id='cityList' style='display:none;'>world;</div></div>";
    return result;
}

//03.03 This method creates content for World page
function HTMLListOfCountries() {
    var result = "<div id='MainContainer'>";

    //Number of all visited cities/places in the world
    var NumberOfVisitedCities = 0;
    for (var i = 0; i < ArrayOfVisitedCountries.length; i++) {
        NumberOfVisitedCities += ArrayOfVisitedCountries[i].visitedCitiesList.length
    }

    //List of visited countries splited per continents
    for (var j = 0; j < continents.length; j++) {
        if (undefined != continents[j].nameru) {
            var CountriesPerContNum = 0;
            var CitiesPerContNum = 0;
            var ListOfCountries = "";
            for (var a = 0; a < ArrayOfVisitedCountries.length; a++) {
                if (ArrayOfVisitedCountries[a].contId == continents[j].id) {
                    CountriesPerContNum += 1;
                    CitiesPerContNum += ArrayOfVisitedCountries[a].visitedCitiesList.length;
                    ListOfCountries += "<a id='" + ArrayOfVisitedCountries[a].countryName +
                    "' title='Перейти к информации о стране' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'><img src='IMG/flag_n_emblem/small_flags/" +
					ArrayOfVisitedCountries[a].countryName + ".png' title='" + ArrayOfVisitedCountries[a].nameRu + " - " +
					ArrayOfVisitedCountries[a].nameNt + " - " + ArrayOfVisitedCountries[a].nameEn + " - " +
                    EndOfLocationWord(ArrayOfVisitedCountries[a].visitedCitiesList.length) + "' class='countflag' /></a>"
                }
            }
            if (CountriesPerContNum > 0) {
                result += "<div class='my_countries'><div><b>" + continents[j].nameru + ":</b> " + EndOfCountryWord(CountriesPerContNum) + " (" + EndOfLocationWord(CitiesPerContNum) + ")</div>" + ListOfCountries + "</div>";
            }
        }
    }
    result += HTMLHiddenWorldMapCreator();
    result += "<div class='countryhead'>Всего: " + EndOfCountryWord(ArrayOfVisitedCountries.length) + " (" + EndOfLocationWord(NumberOfVisitedCities) + ")</div></div>";
    return result;
}