//07.01 Creator of page
function createCityPage_HTML(cityId) {
    var city = $.grep (citiesVisited, function( n, i ) {
        return (n.city_id == cityId)
    });

    // Set global variable with type of map to be opened
    local = [];
    local.push(cityId, city[0]);

    // Set url
    window.history.pushState("object or string", "Title", "index.html?cityId="+cityId);

    //Add Country main content
    document.getElementById("mainSection").innerHTML = "<div class='countrylabel h3'>" + local[1].setFullCityName() + "</div>" +
                                                         HTML_CityDetais(cityId)

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-2017, Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//07.02 Creation of
function HTML_CityDetais(cityId) {
    var result;
    var city = local[1];

    //Country name that this city belongs to
    result = "<div class='countrydetail'><b>Страна:</b> <a id='" + city.getCountryId() + "' title='Перейти к информации о стране' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
             			     getFullRusCountryName(city.getCountryId()) + "</a></div>";

    //Country name that this city belongs to
    result += "<div class='countrydetail'><b>Регион:</b> " + city.getRegion().setFullRegionName() + "</div>";

    //Capital identificator
    if (city.capital == true) {result += "<div class='countrydetail'><b>Столица:</b> <img src='IMG/icon/crown.png' class='crown' /></div>"}

    //Link to google map
    var lat = city.lat;
    var long = city.long;
    if (city.lat_2){
        lat = city.lat_2;
        long = city.long_2;
    }

    if (lat != undefined){
        result += "<div class='countrydetail'><b>Координаты:</b> <a title='Посмотреть на карте' href='https://www.google.com/maps/@" + lat + "," + long + ",12z' target='_blank'>" +
              				lat + " с.ш. " + long + " в.д.</a></div>";
    }

    //City description
    if (city.description != undefined){
        result += "<div class='countrydetail'><b>Описаниие:</b> " + city.description + "</div>";
    }

    //Date of city visit
    result += "<div class='countrydetail'><b>Дата посещения:</b> " + createListOfVisites() + "</div>";

    //Create list of pictures
    var imagesList = "";
    if (city.image != "" && city.image != null){
        imagesList += "<b>Фото:</b><br>";
        $.each (city.image.split(","), function( i, image ){
            imagesList += "<img src='IMG/" + image + "' class='city_photo img-thumbnail' />"
        });
    }
    result += "<div class='countrydetail'>" + imagesList + "</div>";

    return result;
}