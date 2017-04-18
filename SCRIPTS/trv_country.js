//05. Country page

//05.01 Creator of page
function createCountryPage_HTML(countryId) {
    //Add Country main content
    document.getElementById("someElement").innerHTML = getFullCountryName_HTML(countryId) +
   "<div id='mapdiv'></div>";
//    "<div id='countryToVisitSelector'>" +
//    "<div class='switchlink_l float_l'>Мои локации...</div>" +
//    "<div class='switchlink float_l'><a id='" + countryId + "'title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryVisits(this.id)'' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
//    "<div class='clear' />" + HTMLListOfCities(countryId) + ListOfRegionsAndCities(countryId) + "</div>" +
//   HTML_FlagEmblem(countryId);
//
//    //Add script for map creation
//    var map_path = 'SCRIPTS/MAPS/' + countryId + 'Low.js';
//    console.log("Append map ", map_path);
//
//    $.getScript(map_path, function(){
//        console.log("Map appended");
//        //Add country map to page
//        $('#mapdiv').addClass('map');
//		CreateMap(countryId);
//    });
    //Add name, flag and emblem of country
    //document.getElementById("left_block").innerHTML = HTML_CountryName(countryId) + HTML_FlagEmblem(countryId);
}

//function HTML_CreatorOfCountryPage(countryId) {
//    //Add script for map creation
//    $('<script src="SCRIPTS/MAPS/' + countryId + 'Low.js" type="text/javascript"></script>').appendTo("body");

//    //Add name, flag and emblem of country
//    //document.getElementById("left_block").innerHTML = HTML_CountryName(countryId) + HTML_FlagEmblem(countryId);

//    //Add Country main content
//    document.getElementById("someElement").innerHTML = HTML_CountryName(countryId) +
//	  "<div id='mapdiv' class='map'></div>" +
//    "<div id='countryToVisitSelector'>" +
//    "<div class='switchlink_l float_l'>Мои локации...</div>" +
//    "<div class='switchlink float_l'><a id='" + countryId + "'title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryVisits(this.id)'' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
//    "<div class='clear' />" + HTMLListOfCities(countryId) + ListOfRegionsAndCities(countryId) + "</div>" +
//	HTML_FlagEmblem(countryId);

//    //Add country map to page
//    CreateMap(countryId);
//}

////05.02 This method creates content for Country page
//function HTMLListOfCities(countryId) {
//    var result = "";
//    for (var a = 0; a < ArrayOfVisitedCountries.length; a++) {
//        if (ArrayOfVisitedCountries[a].countryName == countryId) {
//            //01. Total number of visited cities
//            result += "<div class='countrydetail'><b>Всего посещено:</b> " + EndOfLocationWord(ArrayOfVisitedCountries[a].visitedCitiesList.length) + " (" + EndOfRegionWord(ArrayOfVisitedCountries[a].visitedRegionsList.length) + ")</div>"
//
//            //02. Total number and link to stories
//            var storiesArrayList = [];
//            var storiesTextList = "нет";
//            var ListOfStories;
//            for (var s = 0; s < visites.length; s++) {
//                if (visites[s].id == ArrayOfVisitedCountries[a].id && visites[s].story != "") {
//                    var storyDate = visites[s].date.split(".")
//                    var storyMonth = storyDate[1]-1;
//
//                    if (storyDate[1].charAt(0) == 0) {
//                          storyMonth = storyDate[1].substring(1, 2)-1;
//                     }
//
//					switch(visites[s].story) {
//			            case "1":
//                            storiesTextList += "<a title='Перейти к истории' id='" + visites[s].id + visites[s].date +
//						                     "' onmouseover='' style='cursor: pointer;' onclick='javascript:HTML_CreatorOfStoryPage(this.id)'>" +
//                                             storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + "</a>, ";
//			            break;
//				        case "2":
//				            if (visites[s].story2.length == 12) {
//                                storiesTextList += "<a title='Перейти к истории' id='" + visites[s].story2 +
//						                     "' onmouseover='' style='cursor: pointer;' onclick='javascript:HTML_CreatorOfStoryPage(this.id)'>" +
//                                             storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + "</a>, ";
//                            }
//                            else {
//							    var visitUrl = visites[s].story2.substring(4, visites[s].story2.length);
//                                storiesTextList += "<a title='Перейти к истории' href='" + visitUrl + "' target='_blank'>" +
//                                            storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + "</a>, ";
//							}
//				        break;
//				        default:
//				            storiesTextList += "<a title='Перейти к истории' href='" + visites[s].story + "' target='_blank'>" +
//                                            storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + "</a>, ";
//					}
//                }
//            }
//
//            if (storiesTextList.length > 3) {
//                ListOfStories = storiesTextList.substring(3, storiesTextList.length - 2);
//            }
//            else {
//                ListOfStories = storiesTextList;
//            }
//
//            result += "<div class='countrydetail'><b>Отчеты:</b> " + ListOfStories + "</div>"
//
//            //03. Link to photos
//            var photoAlbumsNum = 0;
//            var photoAlbumLink = "";
//            for (var s = 0; s < ArrayOfVisitsSorted.length; s++) {
//                if (ArrayOfVisitsSorted[s].id == ArrayOfVisitedCountries[a].id && ArrayOfVisitsSorted[s].photos != "") {
//                    photoAlbumsNum += 1;
//                    var VisitedCities = ArrayOfVisitsSorted[s].place.split(" ");
//                    var VisitedCitiesText = "";
//                    for (var r = 0; r < VisitedCities.length; r++) {
//                        for (var t = 0; t < cities.length; t++) {
//                            if (cities[t].id == VisitedCities[r]) {
//                                VisitedCitiesText += cities[t].title_ru + ", ";
//                            }
//                        }
//                    }
//
//                    var VisitDateToShow = "";
//                    if (ArrayOfVisitsSorted[s].date.toDateString() == ArrayOfVisitsSorted[s].enddate.toDateString()) {
//                        var Day = ArrayOfVisitsSorted[s].date.getDate();
//                        var Month = ArrayOfVisitsSorted[s].date.getMonth();
//                        var Year = ArrayOfVisitsSorted[s].date.getFullYear();
//                        VisitDateToShow += Day + " " + russianMonth(Month) + "." + Year;
//                    }
//                    else {
//                        var StartDay = ArrayOfVisitsSorted[s].date.getDate();
//                        var StartMonth = ArrayOfVisitsSorted[s].date.getMonth();
//                        var EndDay = ArrayOfVisitsSorted[s].enddate.getDate();
//                        var EndMonth = ArrayOfVisitsSorted[s].enddate.getMonth();
//                        var EndYear = ArrayOfVisitsSorted[s].enddate.getFullYear();
//                        VisitDateToShow = StartDay + " " + russianMonth(StartMonth) + " - " + EndDay + " " + russianMonth(EndMonth) + "." + EndYear;
//                    }
//
//                    var ListOfCitiesToShow = VisitedCitiesText.substring(0, VisitedCitiesText.length - 2);
//                    photoAlbumLink += "<a href='" + ArrayOfVisitsSorted[s].photos + "' title='" + ListOfCitiesToShow + "' target='_blank'>" + VisitDateToShow + "; </a>";
//                }
//            }
//
//            result += "<div class='countrydetail'><b>Фото:</b> " + EndOfPhotoalbumWord(photoAlbumsNum) + "; " + photoAlbumLink + "</div>";
//            //"<a href='http://quetzal.io.ua/album558954' title='Тирана, Дуррес, Шкодер' target='_blank'>27.авг.2012; </a></div>";
//
//            //04. Link to technical information
//            var techinfo_1 = ArrayOfVisitedCountries[a].countryName + ",";
//            for (var x = 0; x < ArrayOfVisitedCountries[a].visitedRegionsList.length; x++) {
//                techinfo_1 += ArrayOfVisitedCountries[a].visitedRegionsList[x] + ",";
//            }
//
//            var techinfo_2 = ArrayOfVisitedCountries[a].countryName + ";";
//            for (var m = 0; m < ArrayOfVisitedCountries[a].visitedCitiesList.length; m++) {
//                for (var t = 0; t < cities.length; t++) {
//                    if (cities[t].id == ArrayOfVisitedCountries[a].visitedCitiesList[m]) {
//                        techinfo_2 += cities[t].title + "," + cities[t].lat + "," + cities[t].long + ";";
//                        break;
//                    }
//                }
//            }
//
//            result += "<div id='countryList' style='display:none;'>" + techinfo_1 + "</div>" +
//            "<div id='cityList' style='display:none;'>" + techinfo_2 + "</div>" +
//            "</div>";
//            break;
//        }
//    }
//    return result;
//}

//05.03 Creation of Name section
function getFullCountryName_HTML(countryId) {
    var result = "<div class='countrylabel'>" + getFullCountryName(countryId) + "</div>";
    return result;
}

////05.04 Creation of Flag and Emblem section
//function HTML_FlagEmblem(countryId) {
//    var result = "<div class='countryEmbFlag'>&nbsp;</div>" +
//	"<div class='countryEmbFlag'><img alt='emb of the " + countryId + "' title='emb of the " + countryId +
//    "' src='IMG/flag_n_emblem/" + countryId + "_emb.png' class='country_emb' />" +
//	"<img alt='flag of the " + countryId + "' title='flag of the " + countryId +
//    "' src='IMG/flag_n_emblem/" + countryId + "_flag.png' class='country_flag' /></div>";
//    return result;
//}
//
////05.05 Country page with list of Visits
//function OpenListOfCountryVisits(countryId) {
//    var result = "<div class='switchlink_l float_l'><a id='" + countryId + "' title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryCities(this.id)'' onmouseover='' style='cursor: pointer;'>Мои локации</a></div>" +
//        "<div class='switchlink float_l'>Мои визиты...</div><div class='clear' />" +
//        HTMLListOfWCountryVisits(countryId);
//    document.getElementById("countryToVisitSelector").innerHTML = result;
//}
//
////05.06 World page with list of Visits
//function OpenListOfCountryCities(countryId) {
//    var result = "<div class='switchlink_l float_l'>Мои локации...</div>" +
//        "<div class='switchlink float_l'><a id='" + countryId + "' title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryVisits(this.id)'' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
//        "<div class='clear' />" + HTMLListOfCities(countryId) + ListOfRegionsAndCities(countryId);
//    document.getElementById("countryToVisitSelector").innerHTML = result;
//}
//
////05.07 List of regions and cities
//function ListOfRegionsAndCities(countryId) {
//    var result = "<div class='countrydetail'><b>Полный список посещенных регионов и локаций:</b></div>";
//    var listOfRegionAccended = [];
//
//    for (var x = 0; x < ArrayOfVisitedCountries.length; x++) {
//        if (ArrayOfVisitedCountries[x].countryName == countryId) {
//            for (var c = 0; c < ArrayOfVisitedCountries[x].visitedRegionsList.length; c++) {
//                if (ArrayOfVisitedCountries[x].visitedRegionsList[c] != undefined) {
//                    var regionObject = {}
//                    regionObject.id = ArrayOfVisitedCountries[x].visitedRegionsList[c];
//                    regionObject.text = HTML_FullRegionName(ArrayOfVisitedCountries[x].id, ArrayOfVisitedCountries[x].visitedRegionsList[c]);
//                    listOfRegionAccended.push(regionObject);
//                }
//            }
//
//            listOfRegionAccended.sort(dynamicSort("text"));
//
//            for (var l = 0; l < listOfRegionAccended.length; l++) {
//                result += "<div class='clear countryregion'><b>Регион:</b> " + listOfRegionAccended[l].text + "</div>";
//                result += "<div class='cityrow'>&#8226; <b>Локации: </b>";
//                var ListOfLocations = "";
//                for (var v = 0; v < ArrayOfVisitedCountries[x].visitedCitiesList.length; v++) {
//                    for (var b = 0; b < cities.length; b++) {
//                        if (ArrayOfVisitedCountries[x].visitedCitiesList[v] == cities[b].id && listOfRegionAccended[l].id == cities[b].mc_name) {
//                            ListOfLocations += "<a title='Перейти к информации о локации' id='" + ArrayOfVisitedCountries[x].visitedCitiesList[v] +
//							"' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
//                            HTML_ShortLocationName(ArrayOfVisitedCountries[x].visitedCitiesList[v]) + "</a>, ";
//                        }
//                    }
//                }
//                result += ListOfLocations.substring(0, ListOfLocations.length - 2) + "</div>"
//            }
//        }
//    }
//
//    return result
//}
//
////05.08 This method creates list of country visits
//function HTMLListOfWCountryVisits(countryName) {
//    var CountryId = CountryIdReturner(countryName);
//    var ArrayOfCountryVisits = [];
//    for (var a = 0; a < ArrayOfVisitsSorted.length; a++) {
//        if (ArrayOfVisitsSorted[a].id == CountryId) {
//            ArrayOfCountryVisits.push(ArrayOfVisitsSorted[a]);
//        }
//    }
//
//    var result = "";
//    var VisitYear = ArrayOfCountryVisits[0].date.getFullYear();
//    for (var a = 0; a < ArrayOfCountryVisits.length; a++) {
//        if (a == 0) {
//            result += "<div class='visityear clear'>" + ArrayOfCountryVisits[a].date.getFullYear() + "</div>";
//        }
//        else {
//            if (ArrayOfCountryVisits[a].date.getFullYear() != VisitYear) {
//                result += "<div class='visityear clear'>" + ArrayOfCountryVisits[a].date.getFullYear() + "</div>";
//                VisitYear = ArrayOfCountryVisits[a].date.getFullYear();
//            }
//        }
//
//        if (ArrayOfCountryVisits[a].date.toDateString() == ArrayOfCountryVisits[a].enddate.toDateString()) {
//            var Day = ArrayOfCountryVisits[a].date.getDate();
//            var Month = ArrayOfCountryVisits[a].date.getMonth();
//            //var Year = ArrayOfCountryVisits[a].date.getYear();
//            var startDate = Day + " " + russianMonth(Month);
//            result += "<div class='firstcell float_l'>" + startDate + "</div>";
//        }
//        else {
//            var StartDay = ArrayOfCountryVisits[a].date.getDate();
//            var StartMonth = ArrayOfCountryVisits[a].date.getMonth();
//            var EndDay = ArrayOfCountryVisits[a].enddate.getDate();
//            var EndMonth = ArrayOfCountryVisits[a].enddate.getMonth();
//            var startEndDate = StartDay + " " + russianMonth(StartMonth) + " - " + EndDay + " " + russianMonth(EndMonth);
//            result += "<div class='firstcell float_l'>" + startEndDate + "</div>";
//        }
//
//        var citiesVisited = ArrayOfCountryVisits[a].place.split(" ");
//        var cityLinks = "";
//        for (var c = 0; c < citiesVisited.length; c++) {
//            for (var d = 0; d < cities.length; d++) {
//                if (citiesVisited[c] == cities[d].id) {
//                    cityLinks += "<a id='" + cities[d].id +
//                    //Can be added to display a city on the map: onmouseover='CreateMap(this.id)' onmouseout=\"CreateMap('none')\"
//                    //"' id='" + cities[d].title + "," + cities[d].lat + "," + cities[d].long + ";" +
//                    "' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" + cities[d].title_ru + "</a>, ";
//                    break;
//                }
//            }
//        }
//        cityLinks = cityLinks.slice(0, -2)
//
//        result += "<div class='secondcell float_l'>" + cityLinks + "</div>";
//        result += "<br class='clear'>";
//    }
//    return result;
//}