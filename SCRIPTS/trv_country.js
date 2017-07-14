//05. Country page

//05.01 Creator of page
function createCountryPage_HTML(countryId) {
    var country = $.grep (countriesVisited, function( n, i ) {
        return (n.short_name == countryId)
    });

    // Set global variable with type of map to be opened
    local = [];
    local.push(countryId, country[0]);

    // Set url
    window.history.pushState("object or string", "Title", "index.html?country="+countryId);

    //Add Country main content
    document.getElementById("mainSection").innerHTML =
    "<div class='countrylabel'>" + local[1].setFullCountryName() + "</div>" +
    "<div id='mapdiv' class='map loading'>&nbsp;</div>" +
    "<div id='countryToVisitSelector'>" +
    "<div class='switchlink_l float_l'>Мои локации...</div>" +
    "<div class='switchlink float_l'><a id='" + countryId + "'title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryVisits(this.id)'' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
    "<div class='clear' />" + getCountryDetails_HTML() + getCitiesAndRegionsList_HTML() + "</div>" +
    getFlagEmblem_HTML(countryId);

    //Creation of world map
    drawMap();
}

//05.02 This method creates content for Country page
function getCountryDetails_HTML() {
    var result = "";
    var country = local[1];

    //01. Total number of visited cities
    result += "<div class='countrydetail'><b>Всего посещено:</b> " + setLocationNumberWithCorrectEnd(country.getNumberOfVisitedCities()) +
              " (" + setRegionsNumberWithCorrectEnd(country.getNumberOfVisitedRegions()) + ")</div>";

    //02. Total number and link to stories
//            var storiesArrayList = [];
//            var storiesTextList = "нет";
              var ListOfStories = "";
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
            result += "<div class='countrydetail'><b>Отчеты:</b> " + ListOfStories + "</div>"

    //03. Link of photos
    var photoAlbumLinks = "";
    $.each (visitsSorted, function( i, visit ){
        var citiesShownInPhotoAlbum = "";
        var VisitDateToShow = getVisitDate (visit.start_date, visit.end_date, true);

        $.each (visit.cities, function( i, city ){
            if (city.country_id == country.short_name && visit.photos != undefined) {
                citiesShownInPhotoAlbum += getRusLocationName(city.city_id) + ", " ;
            }
        });

        if (citiesShownInPhotoAlbum != ""){
            photoAlbumLinks += "<a href='" + visit.photos + "' title='" + citiesShownInPhotoAlbum.substring(0, citiesShownInPhotoAlbum.length-2) + "' target='_blank'>" + VisitDateToShow + "; </a>";
        }

    });

    result += (photoAlbumLinks != "") ? "<div class='countrydetail'><b>Фото:</b> " + photoAlbumLinks + "</div>" : "";
    //"<a href='http://quetzal.io.ua/album558954' title='Тирана, Дуррес, Шкодер' target='_blank'>27.авг.2012; </a></div>";

    //04. Link to technical information
    var techinfo_1 = country.short_name + "," + country.getListOfVisitedRegions();

    var techinfo_2 = country.short_name + ";";
    $.each (citiesVisited, function( j, city ){
        if (city.getCountryId() == country.short_name) {
            techinfo_2 += city.name_ru + "," + city.lat + "," + city.long + ";"
        }
    });

    result += "<div id='countryList' style='display:none;'>" + techinfo_1 + "</div>" +
    "<div id='cityList' style='display:none;'>" + techinfo_2 + "</div>" +
    "</div>";

    return result;
}

//05.03 Creation of Flag and Emblem section
function getFlagEmblem_HTML(countryId) {
    var result = "<div class='countryEmbFlag'>&nbsp;</div>" +
	"<div class='countryEmbFlag'><img alt='emb of the " + countryId + "' title='emb of the " + countryId +
    "' src='IMG/flag_n_emblem/" + countryId + "_emb.png' class='country_emb' />" +
	"<img alt='flag of the " + countryId + "' title='flag of the " + countryId +
    "' src='IMG/flag_n_emblem/" + countryId + "_flag.png' class='country_flag' /></div>";
    return result;
}

//05.04 Country page with list of Visits
function OpenListOfCountryVisits(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l float_l'><a id='" + countryId + "' title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryCities(this.id)'' onmouseover='' style='cursor: pointer;'>Мои локации</a></div>" +
        "<div class='switchlink float_l'>Мои визиты...</div><div class='clear' />" +
        createListOfVisites();
}

//05.05 Country page with list of Cities
function OpenListOfCountryCities(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l float_l'>Мои локации...</div>" +
        "<div class='switchlink float_l'><a id='" + countryId + "' title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryVisits(this.id)'' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
        "<div class='clear' />" + getCountryDetails_HTML() + getCitiesAndRegionsList_HTML();
    ;
}

//05.06 List of regions and cities
function getCitiesAndRegionsList_HTML () {
    var country = local[1];
    var result = "<div class='countrydetail'><b>Полный список посещенных регионов и локаций:</b></div>";

    $.each (regionsVisited, function( i, region ){
        if (region.country_id == country.country_id) {
            result += "<div class='clear countryregion'><b>Регион:</b> " + region.setFullRegionName() + "</div>";
            result += "<div class='cityrow'>&#8226; <b>Локации: </b>";
            var ListOfLocations = "";
            $.each (citiesVisited, function( i, city ){
                    if (region.region_id == city.region_id) {
                        ListOfLocations += "<a title='Перейти к информации о локации' id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)'" +
                                           " onmouseover='' style='cursor: pointer;'>" + city.name_ru + "</a>, ";
                    }

                });
            result += ListOfLocations.substring(0, ListOfLocations.length - 2) + "</div>";
        }
    });

    return result
}