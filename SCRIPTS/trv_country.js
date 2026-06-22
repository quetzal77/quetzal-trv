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
    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?country="+countryId); }
    setPageMeta(country[0].name_ua, "index.html?country=" + countryId);

    var typeName = getCountryTypeName(local[1].country_type_id);
    var typeHtml = typeName ? "<div class='country-type'><span>" + getCountryTypeIcon(local[1].country_type_id) + " " + typeName + "</span></div>" : "";

    //Add Country main content
    document.getElementById("mainSection").innerHTML =
    "<div class='countrylabel h3'>" + local[1].setFullCountryName() + "</div>" +
    typeHtml +
    "<div id='mapdiv' class='map loading'>&nbsp;</div>" +
    "<div id='countryToVisitSelector'>" +
    "<div class='switchlink_l'>Мої локації...</div>" +
    "<div class='switchlink'><a id='" + countryId + "' title='Перейти до списку візитів' onclick='javascript:OpenListOfCountryVisits(this.id)' onmouseover='' style='cursor: pointer;'>Мої візити</a></div>" +
    getCountryDetails_HTML() + getCitiesAndRegionsList_HTML() + "</div>" +
    getFlagEmblem_HTML(country[0]);

    //Highlight the active section in the navbar
    setActiveNav();

    //Creation of world map
    drawMap();

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-" + new Date().getFullYear() + ", Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//05.02 This method creates content for Country page
function getCountryDetails_HTML() {
    var result = "";
    var country = local[1];

    //01. Visited locations · visited/total regions, with a home-page-style progress bar
    var visitedRegions = country.getNumberOfVisitedRegions();
    var totalRegions = 0;
    $.each (data.area, function( i, area ){
        if (area.country_id == country.country_id && area.active != "N") { totalRegions += 1; }
    });
    var regionsHtml = (totalRegions > 0)
        ? "<b>" + visitedRegions + "</b> з <b>" + totalRegions + "</b> регіонів"
        : setRegionsNumberWithCorrectEnd(visitedRegions);
    var regionsBar = (totalRegions > 0)
        ? "<div class='cont-progress'><span style='width:" + Math.min(100, Math.round(visitedRegions / totalRegions * 100)) + "%'></span></div>"
        : "";
    var allRegionsTrophy = (totalRegions > 0 && visitedRegions >= totalRegions)
        ? " <span class='regions-trophy' title='Усі регіони відвідано!'>🏆</span>"
        : "";
    result += "<div class='countrydetail'><b>Усього відвідано:</b> " +
              setLocationNumberWithCorrectEnd(country.getNumberOfVisitedCities(), true) +
              " · " + regionsHtml + regionsBar + allRegionsTrophy + "</div>";

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
                    citiesShownInPhotoAlbum += (city.country_id == country.short_name) ? getUaLocationName(city.city_id) + ", " : "" ;
            });

            photoAlbumLinks += (citiesShownInPhotoAlbum != "") ? "<a href='" + visit.photos + "' title='" + citiesShownInPhotoAlbum.substring(0, citiesShownInPhotoAlbum.length-2) +
                                   "' target='_blank'>" + VisitDateToShow.slice(0, -2) + "; </a>" : "";
        }
    });

    result += (ListOfStories.length > 0) ? "<div class='countrydetail'><b>Звіти:</b> " + ListOfStories + "</div>" : "";

    result += (photoAlbumLinks.length > 0) ? "<div class='countrydetail'><b>Фото:</b> " + photoAlbumLinks + "</div>" : "";

    //04. Link to technical information
    var techinfo_1 = "";
    if (country.map_img != undefined) {
        techinfo_1 = country.map_img.slice(0, -3) + "," + country.getListOfVisitedRegions();
    }


    var techinfo_2 = country.short_name + ";";
    if (!country.city_state){
        $.each (citiesVisited, function( j, city ){
            if (city.getCountryId() == country.short_name) {
                techinfo_2 += city.name_ua + "," + city.lat + "," + city.long + ";"
            }
        });
    }

    result += "<div id='countryList' style='display:none;'>" + techinfo_1 + "</div>" +
    "<div id='cityList' style='display:none;'>" + techinfo_2 + "</div>";

    return result;
}

//05.03 Creation of Flag and Emblem section
function getFlagEmblem_HTML(country) {
    var images = "";

    if (country.flag_img != "" && country.flag_img != undefined ){
        images += "<span class='flag-wrap'><img alt='Прапор " + country.short_name + "' title='Прапор' src='IMG/flag_n_emblem/" + country.flag_img + "' class='country_flag' loading='lazy' decoding='async' /></span>";
    }
    if (country.emb_img != "" && country.emb_img != undefined ){
        images += "<img alt='Герб " + country.short_name + "' title='Герб' src='IMG/flag_n_emblem/" + country.emb_img + "' class='country_emb' loading='lazy' decoding='async' />";
    }

    if (images == "") { return ""; }

    return "<div class='symbolics'><h3 class='symbolics-title'>Символіка</h3>" +
           "<div class='symbolics-row'>" + images + "</div></div>";
}

//05.04 Country page with list of Visits
function OpenListOfCountryVisits(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l'><a id='" + countryId + "' title='Перейти до списку локації' onclick='javascript:OpenListOfCountryCities(this.id)' onmouseover='' style='cursor: pointer;'>Мої локації</a></div>" +
        "<div class='switchlink'>Мої візити...</div>" +
        createListOfVisites();
}

//05.05 Country page with list of Cities
function OpenListOfCountryCities(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        "<div class='switchlink_l'>Мої локації...</div>" +
        "<div class='switchlink'><a id='" + countryId + "' title='Перейти до списку візитів' onclick='javascript:OpenListOfCountryVisits(this.id)' onmouseover='' style='cursor: pointer;'>Мої візити</a></div>" +
        getCountryDetails_HTML() + getCitiesAndRegionsList_HTML();
}

//05.06 List of regions and cities
function getCitiesAndRegionsList_HTML () {
    var country = local[1];

    // City-states: the region just duplicates the country — show a badge + the single location
    if (country.city_state) {
        var links = "";
        $.each (citiesVisited, function( i, city ){
            if (city.getCountryId() == country.short_name) {
                links += "<a title='Перейти до інформації про локацію' id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" + city.name_ua + "</a>, ";
            }
        });
        return "<div class='countrydetail'><span class='cs-badge'>🏙️ Місто-держава</span></div>" +
               "<div class='cityrow'><b>Локація:</b> " + links.substring(0, links.length - 2) + "</div>";
    }

    var result = "<div class='countrydetail'><b>Повний список відвіданих регіонів та локацій:</b></div>";

    $.each (regionsVisited, function( i, region ){
        if (region.country_id == country.country_id) {
            result += "<div class='countryregion'><b>Регіон:</b> " + region.setFullRegionName() + "</div>";
            result += "<div class='cityrow'>&#8226; <b>Локації: </b>";
            var ListOfLocations = "";
            $.each (citiesVisited, function( i, city ){
                    if (region.region_id == city.region_id) {
                        ListOfLocations += "<a title='Перейти до інформації про локацію' id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)'" +
                                           " onmouseover='' style='cursor: pointer;'>" + city.name_ua + "</a>, ";
                    }

                });
            result += ListOfLocations.substring(0, ListOfLocations.length - 2) + "</div>";
        }
    });

    return result
}