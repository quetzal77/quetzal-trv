//07.01 Creator of page
function createCityPage_HTML(cityId) {
    var city = $.grep (citiesVisited, function( n, i ) {
        return (n.city_id == cityId)
    });

    // Set global variable with type of map to be opened
    local = [];
    local.push(cityId, city[0]);

    // Set url
    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?cityId="+cityId); }
    setPageMeta(entityName(city[0]), "index.html?cityId=" + cityId);

    //Add Country main content
    document.getElementById("mainSection").innerHTML = "<div class='countrylabel h3'>" + local[1].setFullCityName() + "</div>" +
                                                         HTML_CityDetais(cityId)

    //Highlight the active section in the navbar
    setActiveNav();

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-" + new Date().getFullYear() + ", Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//07.02 Creation of
function HTML_CityDetais(cityId) {
    var result;
    var city = local[1];

    //Country name that this city belongs to
    result = "<div class='countrydetail'><b>" + t('cityCountry') + "</b> <a id='" + city.getCountryId() + "' title='" + t('goToCountry') + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                         getFullUaCountryName(city.getCountryId()) + "</a></div>";

    //Region — or a city-state badge when the region just duplicates the country
    var ctry = $.grep (data.country, function( n, i ) { return (n.short_name == city.getCountryId()); });
    if (ctry[0] && ctry[0].city_state === "true") {
        result += "<div class='countrydetail'><span class='cs-badge'>🏙️ " + t('cityCityState') + "</span></div>";
    } else {
        result += "<div class='countrydetail'><b>" + t('cityRegion') + "</b> " + city.getRegion().setFullRegionName() + "</div>";
    }

    //Capital identificator
    if (city.capital == true) {result += "<div class='countrydetail'><b>" + t('cityCapital') + "</b> <span class='capital-badge'><svg viewBox='0 0 24 24' fill='currentColor'><path d='M4 9l3.6 2.6L12 5l4.4 6.6L20 9l-1.7 9.2H5.7L4 9z'/></svg> " + t('cityCapitalOf') + "</span></div>";}

    //Link to google map
    var lat = city.lat;
    var long = city.long;
    if (city.lat_2){
        lat = city.lat_2;
        long = city.long_2;
    }

    if (lat != undefined){
        result += "<div class='countrydetail'><b>" + t('cityCoords') + "</b> <a title='" + t('cityViewOnMap') + "' href='https://www.google.com/maps/@" + lat + "," + long + ",12z' target='_blank'>" +
                  lat + " " + t('cityLatSuffix') + " " + long + " " + t('cityLonSuffix') + "</a></div>";
    }

    //City description (hidden in EN — content is Ukrainian only)
    if (city.description != undefined && window.LANG !== 'en'){
        result += "<div class='countrydetail'><b>" + t('cityDescription') + "</b> " + city.description + "</div>";
    }

    //Date of city visit
    result += "<div class='countrydetail'><b>" + t('cityVisitDates') + "</b> " + createListOfVisites() + "</div>";

    //Create list of pictures
    var imagesList = "";
    if (city.image != "" && city.image != null){
        imagesList += "<b>" + t('cityPhotos') + "</b><br>";
        $.each (city.image.split(","), function( i, image ){
            imagesList += "<img src='IMG/" + image + "' class='city_photo' loading='lazy' decoding='async' />"
        });
    }
    result += "<div class='countrydetail'>" + imagesList + "</div>";

    return result;
}