//03. World page
//03.01 Creator of page
function HTML_CreatorOfWorldPage() {
    //Creation of Country Selector
    document.getElementById("ContentBody_CountryList").innerHTML = HTML_SelectorListOfCountries();
    //Creation of City Selector
    document.getElementById("ContentBody_CityList").innerHTML = HTML_SelectorListOfCities();
	//Creation of Story Selector
    document.getElementById("ContentBody_StoryList").innerHTML = HTML_SelectorListOfStories();

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
    for (var i = 0; i < ArrayOfVisitedCountries.length; i++) {
        result += ArrayOfVisitedCountries[i].id + ",";
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

//03.04 This method creates list of worlds visits
function HTMLListOfWorldVisits() {
    //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
    //         <div class="secondcell float_l"><a href="countries.aspx?country=poland" id="25,52,19.5;Katowice,50.2599736,19.0284561;Wroclaw,51.122489,17.026062;Swidnica,50.8403152,16.4935923;Ksiaz,50.8440566,16.2897844;Opole,50.6780534,17.9175784;" onmouseover="CreateMap(this.id)" onmouseout="CreateMap('none')">Катовице, Вроцлав, Свидница, Кщёнж, Ополе (Польша)</a></div>
    //         <br class="clear">
    var result = "";
    var VisitYear = ArrayOfVisitsSorted[0].date.getFullYear();

    for (var a = 0; a < ArrayOfVisitsSorted.length; a++) {
        if (a == 0) {
            result += "<div class='visityear clear'>" + ArrayOfVisitsSorted[a].date.getFullYear() + "</div>";
        }
        else {
            if (ArrayOfVisitsSorted[a].date.getFullYear() != VisitYear) {
                result += "<div class='visityear clear'>" + ArrayOfVisitsSorted[a].date.getFullYear() + "</div>";
                VisitYear = ArrayOfVisitsSorted[a].date.getFullYear();
            }
        }

        if (ArrayOfVisitsSorted[a].date.toDateString() == ArrayOfVisitsSorted[a].enddate.toDateString()) {
            var Day = ArrayOfVisitsSorted[a].date.getDate();
            var Month = ArrayOfVisitsSorted[a].date.getMonth();
            //var Year = ArrayOfVisitsSorted[a].date.getYear();
            var startDate = Day + " " + russianMonth(Month);
            result += "<div class='firstcell float_l'>" + startDate + "</div>"
        }
        else {
            var StartDay = ArrayOfVisitsSorted[a].date.getDate();
            var StartMonth = ArrayOfVisitsSorted[a].date.getMonth();
            var EndDay = ArrayOfVisitsSorted[a].enddate.getDate();
            var EndMonth = ArrayOfVisitsSorted[a].enddate.getMonth();
            var startEndDate = StartDay + " " + russianMonth(StartMonth) + " - " + EndDay + " " + russianMonth(EndMonth);
            result += "<div class='firstcell float_l'>" + startEndDate + "</div>"
        }

        var countryId = "";
        var countryRusName = "";
        var zoomLat = "";
        var zoomLong = "";
        var zoomLvl = "";
        for (var b = 0; b < countries.length; b++) {
            if (countries[b].id == ArrayOfVisitsSorted[a].id) {
                countryId += countries[b].ident;
                countryRusName += countries[b].nameru;
                zoomLat += countries[b].zoomLat;
                zoomLong += countries[b].zoomLong;
                zoomLvl += countries[b].zoomLvl;
                break;
            }
        }

        var citiesVisited = ArrayOfVisitsSorted[a].place.split(" ");
        var citiesCoordinates = "";
        var citiesRusName = "";
        for (var c = 0; c < citiesVisited.length; c++) {
            for (var d = 0; d < cities.length; d++) {
                if (citiesVisited[c] == cities[d].id) {
                    citiesCoordinates += cities[d].title + "," + cities[d].lat + "," + cities[d].long + ";";
                    citiesRusName += cities[d].title_ru + ", ";
                    break;
                }
            }
        }

        result += "<div class='secondcell float_l'><a id='" + countryId +
        //Can be added to display a city on the map: onmouseover='CreateMap(this.id)' onmouseout=\"CreateMap('none')\"
        //"' id='" + zoomLat + "," + zoomLong + "," + zoomLvl + ";" + citiesCoordinates +
        "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + citiesRusName.slice(0, -2) + " (" + countryRusName + " )</a></div>";
        result += "<br class='clear'>";
    }
    return result;
}

//03.05 World page with list of Visits
function OpenListOfWorldVisits() {
    var result = "<div class='switchlink_l float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldCountries()' onmouseover='' style='cursor: pointer;'>Мои страны</a></div>" +
        "<div class='switchlink float_l'>Мои визиты...</div>" +
        "<br><br>" + HTMLListOfWorldVisits();
    document.getElementById("countryToVisitSelector").innerHTML = result;
}

//03.06 World page with list of Visits
function OpenListOfWorldCountries() {
    var result = "<div class='switchlink_l float_l'>Мои страны...</div>" +
        "<div class='switchlink float_l'><a title='Перейти к списку визитов' onclick='javascript:OpenListOfWorldVisits()' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
        "<br><br>" + HTMLListOfCountries();
    document.getElementById("countryToVisitSelector").innerHTML = result;
}
