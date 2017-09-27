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
    "<div class='countrylabel h3'>" + local[1].setFullCountryName() + "</div>" +
    "<div id='mapdiv' class='map loading'>&nbsp;</div>" +
    "<div id='countryToVisitSelector'>" +
    "<div class='switchlink_l float_l'>Мои локации...</div>" +
    "<div class='switchlink float_l'><a id='" + countryId + "'title='Перейти к списку визитов' onclick='javascript:OpenListOfCountryVisits(this.id)'' onmouseover='' style='cursor: pointer;'>Мои визиты</a></div>" +
    "<div class='clear' />" + getCountryDetails_HTML() + getCitiesAndRegionsList_HTML() + "</div>" +
    getFlagEmblem_HTML(country[0]);

    //Creation of world map
    drawMap();

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-2017, Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//05.02 This method creates content for Country page
function getCountryDetails_HTML() {
    var result = "";
    var country = local[1];

    //01. Total number of visited cities
    result += "<div class='countrydetail'><b>Всего посещено:</b> " + setLocationNumberWithCorrectEnd(country.getNumberOfVisitedCities()) +
              " (" + setRegionsNumberWithCorrectEnd(country.getNumberOfVisitedRegions()) + ")</div>";

    //02.-03. Stories and Photos
    var ListOfStories = "";
    var photoAlbumLinks = "";

    $.each (visitsSorted, function( i, visit ){
        var countriesIDToReturn = "";
        var distinctIds = {};

        var citiesShownInPhotoAlbum = "";
        var VisitDateToShow = getVisitDate (visit.start_date, visit.end_date, true);

        //02. Total number and link to stories
        if (visit.story != "" && visit.story != null && visit.story != undefined){
            $.each (visit.cities, function( i, city ){
                if (!distinctIds[city.country_id]){
                    countriesIDToReturn += city.country_id;
                    distinctIds[city.country_id] = true;
                }
            });

            if (distinctIds[country.short_name]){
                var StartMonth = visit.start_date.getMonth() + 1;

                var url = (visit.story == true) ? "id='" + visit.start_date.getFullYear() + StartMonth + visit.start_date.getDate() + countriesIDToReturn + "' onmouseover='' style='cursor: pointer;' onclick='javascript:getStoryPage(this.id)'"
                                                : "href='" + visit.story + "' target='_blank'";

                ListOfStories += "<a " + url + ">" + VisitDateToShow.slice(0, -2) + ", " + "</a>";
            }
        }

        //03. Link of photos
        if (visit.photos != "" && visit.photos != null && visit.photos != undefined){
            $.each (visit.cities, function( i, city ){
                    citiesShownInPhotoAlbum += (city.country_id == country.short_name) ? getRusLocationName(city.city_id) + ", " : "" ;
            });

            photoAlbumLinks += (citiesShownInPhotoAlbum != "") ? "<a href='" + visit.photos + "' title='" + citiesShownInPhotoAlbum.substring(0, citiesShownInPhotoAlbum.length-2) +
                                   "' target='_blank'>" + VisitDateToShow.slice(0, -2) + "; </a>" : "";
        }
    });

    result += (ListOfStories.length > 0) ? "<div class='countrydetail'><b>Отчеты:</b> " + ListOfStories + "</div>" : "";

    result += (photoAlbumLinks.length > 0) ? "<div class='countrydetail'><b>Фото:</b> " + photoAlbumLinks + "</div>" : "";
    //"<a href='http://quetzal.io.ua/album558954' title='Тирана, Дуррес, Шкодер' target='_blank'>27.авг.2012; </a></div>";

    //04. Link to technical information
    var techinfo_1 = country.map_img.slice(0, -3) + "," + country.getListOfVisitedRegions();

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
function getFlagEmblem_HTML(country) {
    var result = "<div class='countryEmbFlag'>&nbsp;</div><div class='countryEmbFlag'>";

    if (country.emb_img != "" && country.emb_img != undefined ){
        result += "<img alt='emb of the " + country.short_name + "' title='emb of the " + country.short_name +
        "' src='IMG/flag_n_emblem/" + country.emb_img + "' class='country_emb' />";
    }
    if (country.flag_img != "" && country.flag_img != undefined ){
        result += "<img alt='flag of the " + country.short_name + "' title='flag of the " + country.short_name +
        "' src='IMG/flag_n_emblem/" + country.flag_img + "' class='country_flag' />";
    }
    result += "</div>";
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