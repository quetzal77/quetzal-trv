//05. World page
//Scripts for creation of Visits section

//05.01 This method creates list of worlds visits
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