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
    result = "<div class='countrydetail'><b>Країна:</b> <a id='" + city.getCountryId() + "' title='Перейти до інформації про країну' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
             			     getFullUaCountryName(city.getCountryId()) + "</a></div>";

    //Country name that this city belongs to
    result += "<div class='countrydetail'><b>Регіон:</b> " + city.getRegion().setFullRegionName() + "</div>";

    //Capital identificator
    if (city.capital == true) {result += "<div class='countrydetail'><b>Столиця:</b> <span class='capital-badge'><svg viewBox='0 0 24 24' fill='currentColor'><path d='M4 9l3.6 2.6L12 5l4.4 6.6L20 9l-1.7 9.2H5.7L4 9z'/></svg> Столиця країни</span></div>"}

    //Link to google map
    var lat = city.lat;
    var long = city.long;
    if (city.lat_2){
        lat = city.lat_2;
        long = city.long_2;
    }

    if (lat != undefined){
        result += "<div class='countrydetail'><b>Координати:</b> <a title='Подивитись на мапі' href='https://www.google.com/maps/@" + lat + "," + long + ",12z' target='_blank'>" +
              				lat + " с.ш. " + long + " в.д.</a></div>";
    }

    //City description
    if (city.description != undefined){
        result += "<div class='countrydetail'><b>Опис:</b> " + city.description + "</div>";
    }

    //Date of city visit
    result += "<div class='countrydetail'><b>Дата візитів:</b> " + createListOfVisites() + "</div>";

    //Create list of pictures
    var imagesList = "";
    if (city.image != "" && city.image != null){
        imagesList += "<b>Фото:</b><br>";
        $.each (city.image.split(","), function( i, image ){
            imagesList += "<img src='IMG/" + image + "' class='city_photo' />"
        });
    }
    result += "<div class='countrydetail'>" + imagesList + "</div>";

    return result;
}