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
    setPageMeta(entityName(country[0]), "index.html?country=" + countryId);

    var typeName = getCountryTypeName(local[1].country_type_id);
    var typeHtml = typeName ? "<div class='country-type'><span>" + getCountryTypeIcon(local[1].country_type_id) + " " + typeName + "</span></div>" : "";

    //Add Country main content
    document.getElementById("mainSection").innerHTML =
    "<div class='countrylabel h3'>" + local[1].setFullCountryName() + "</div>" +
    typeHtml +
    "<div id='mapdiv' class='map loading'>&nbsp;</div>" +
    "<div id='countryToVisitSelector'>" +
    countryTabsBar_HTML(countryId, "locations") +
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
        ? "<b>" + visitedRegions + "</b> " + t('of') + " <b>" + totalRegions + "</b> " + t('wordRegions')
        : setRegionsNumberWithCorrectEnd(visitedRegions);
    var regionsBar = (totalRegions > 0)
        ? "<div class='cont-progress'><span style='width:" + Math.min(100, Math.round(visitedRegions / totalRegions * 100)) + "%'></span></div>"
        : "";
    var allRegionsTrophy = (totalRegions > 0 && visitedRegions >= totalRegions)
        ? " <span class='regions-trophy' title='" + t('allRegionsVisited') + "'>🏆</span>"
        : "";
    result += "<div class='countrydetail'><b>" + t('totalVisited') + "</b> " +
              setLocationNumberWithCorrectEnd(country.getNumberOfVisitedCities(), true) +
              " · " + regionsHtml + regionsBar + allRegionsTrophy + "</div>";

    //01b. Residence time within this country — sums every residence-type visit here, across all its cities.
    //Periods are summed as raw days (not calendar months) since they can span unrelated date ranges,
    //then the total is decomposed back into years/months/days for display.
    var countryResidences = $.grep(residencesSorted, function(r){ return r.country_id == country.short_name; });
    if (countryResidences.length > 0) {
        var totalDays = 0;
        var seenCities = {};
        var cityNames = [];
        var DAY = 1000 * 60 * 60 * 24;
        $.each(countryResidences, function(i, r){
            totalDays += Math.round((r.end_date - r.start_date) / DAY);
            if (!seenCities[r.city_id]) {
                seenCities[r.city_id] = true;
                cityNames.push(getLocationName(r.city_id));
            }
        });
        result += "<div class='countrydetail'><b>" + t('countryResidenceTime') + "</b> " +
                  formatDurationParts(decomposeDays(totalDays)) + " — " + joinWithAnd(cityNames) + "</div>";
    }

    //02.-03. Stories and Photos
    var ListOfStories = "";
    var photoAlbumLinks = "";

    $.each (visitsSorted, function( i, visit ){
        var countriesIDToReturn = "";
        var distinctIds = {};

        var citiesShownInPhotoAlbum = "";
        var VisitDateToShow = getVisitDate (visit.start_date, visit.end_date, true);

        //02. Total number and link to stories (internal and/or external)
        var sid = getStoryRefId(visit);
        var ext = getExternalStoryUrl(visit);
        if (sid !== null || ext){
            $.each (visit.cities, function( i, city ){
                if (!distinctIds[city.country_id]){
                    countriesIDToReturn += city.country_id;
                    distinctIds[city.country_id] = true;
                }
            });

            if (distinctIds[country.short_name]){
                if (sid !== null) { ListOfStories += "<a id='" + sid + "' onmouseover='' style='cursor: pointer;' onclick='javascript:getStoryPage(this.id)'>" + VisitDateToShow.slice(0, -2) + ", </a>"; }
                if (ext) { ListOfStories += "<a href='" + ext + "' target='_blank'>" + VisitDateToShow.slice(0, -2) + " ↗, </a>"; }
            }
        }

        //03. Link of photos
        if (visit.photos != "" && visit.photos != null && visit.photos != undefined){
            $.each (visit.cities, function( i, city ){
                    citiesShownInPhotoAlbum += (city.country_id == country.short_name) ? getLocationName(city.city_id) + ", " : "" ;
            });

            photoAlbumLinks += (citiesShownInPhotoAlbum != "") ? "<a href='" + visit.photos + "' title='" + citiesShownInPhotoAlbum.substring(0, citiesShownInPhotoAlbum.length-2) +
                                   "' target='_blank'>" + VisitDateToShow.slice(0, -2) + "; </a>" : "";
        }
    });

    result += (ListOfStories.length > 0) ? "<div class='countrydetail'><b>" + t('reports') + "</b> " + ListOfStories + "</div>" : "";

    result += (photoAlbumLinks.length > 0) ? "<div class='countrydetail'><b>" + t('photos') + "</b> " + photoAlbumLinks + "</div>" : "";

    //04. Link to technical information
    var techinfo_1 = "";
    if (country.map_img != undefined) {
        techinfo_1 = country.map_img.slice(0, -3) + "," + country.getListOfVisitedRegions();
    }


    var techinfo_2 = country.short_name + ";";
    if (!country.city_state){
        $.each (citiesVisited, function( j, city ){
            if (city.getCountryId() == country.short_name) {
                techinfo_2 += entityName(city) + "," + city.lat + "," + city.long + ";"
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
        images += "<span class='flag-wrap'><img alt='" + t('flag') + " " + country.short_name + "' title='" + t('flag') + "' src='IMG/flag_n_emblem/" + country.flag_img + "' class='country_flag' loading='lazy' decoding='async' /></span>";
    }
    if (country.emb_img != "" && country.emb_img != undefined ){
        images += "<img alt='" + t('emblem') + " " + country.short_name + "' title='" + t('emblem') + "' src='IMG/flag_n_emblem/" + country.emb_img + "' class='country_emb' loading='lazy' decoding='async' />";
    }

    if (images == "") { return ""; }

    return "<div class='symbolics'><h3 class='symbolics-title'>" + t('symbolics') + "</h3>" +
           "<div class='symbolics-row'>" + images + "</div></div>";
}

//05.04 Country page with list of Visits
function OpenListOfCountryVisits(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        countryTabsBar_HTML(countryId, "visits") +
        createListOfVisites();
}

//05.05 Country page with list of Cities
function OpenListOfCountryCities(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        countryTabsBar_HTML(countryId, "locations") +
        getCountryDetails_HTML() + getCitiesAndRegionsList_HTML();
}

//05.05b Country page with list of places lived in this country (only reachable when the country has residence-type visits)
function OpenListOfCountryLife(countryId) {
    document.getElementById("countryToVisitSelector").innerHTML =
        countryTabsBar_HTML(countryId, "life") +
        createListOfResidences(countryId);
}

//05.05c Shared tab bar (Мої локації / Мої подорожі / Моє життя) — the "Моє життя" tab only appears if this country has residence-type visits
function countryTabsBar_HTML(countryId, active) {
    var hasResidence = $.grep(residencesSorted, function(r){ return r.country_id == countryId; }).length > 0;

    var locationsSeg = (active == "locations")
        ? "<div class='switchlink_l'>" + t('myLocationsDots') + "</div>"
        : "<div class='switchlink_l'><a id='" + countryId + "' title='" + t('goToLocations') + "' onclick='javascript:OpenListOfCountryCities(this.id)' onmouseover='' style='cursor: pointer;'>" + t('myLocations') + "</a></div>";
    var visitsSeg = (active == "visits")
        ? "<div class='switchlink'>" + t('myVisitsDots') + "</div>"
        : "<div class='switchlink'><a id='" + countryId + "' title='" + t('goToVisits') + "' onclick='javascript:OpenListOfCountryVisits(this.id)' onmouseover='' style='cursor: pointer;'>" + t('myVisits') + "</a></div>";
    var lifeSeg = "";
    if (hasResidence) {
        lifeSeg = (active == "life")
            ? "<div class='switchlink'>" + t('myLifeDots') + "</div>"
            : "<div class='switchlink'><a id='" + countryId + "' title='" + t('goToLife') + "' onclick='javascript:OpenListOfCountryLife(this.id)' onmouseover='' style='cursor: pointer;'>" + t('myLife') + "</a></div>";
    }
    return locationsSeg + visitsSeg + lifeSeg;
}

//05.06 List of regions and cities
function getCitiesAndRegionsList_HTML () {
    var country = local[1];

    // City-states: the region just duplicates the country — show a badge + the single location
    if (country.city_state) {
        var links = "";
        $.each (citiesVisited, function( i, city ){
            if (city.getCountryId() == country.short_name) {
                links += "<a title='" + t('goToLocation') + "' id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" + entityName(city) + "</a>, ";
            }
        });
        return "<div class='countrydetail'><span class='cs-badge'>🏙️ " + t('cityState') + "</span></div>" +
               "<div class='cityrow'><b>" + t('locationLabel') + "</b> " + links.substring(0, links.length - 2) + "</div>";
    }

    var result = "<div class='countrydetail'><b>" + t('fullRegionsList') + "</b></div>";

    $.each (regionsVisited, function( i, region ){
        if (region.country_id == country.country_id) {
            result += "<div class='countryregion'><b>" + t('regionLabel') + "</b> " + region.setFullRegionName() + "</div>";
            result += "<div class='cityrow'>&#8226; <b>" + t('locationsLabel') + "</b>";
            var ListOfLocations = "";
            $.each (citiesVisited, function( i, city ){
                    if (region.region_id == city.region_id) {
                        ListOfLocations += "<a title='" + t('goToLocation') + "' id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)'" +
                                           " onmouseover='' style='cursor: pointer;'>" + entityName(city) + "</a>, ";
                    }

                });
            result += ListOfLocations.substring(0, ListOfLocations.length - 2) + "</div>";
        }
    });

    return result
}