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
    document.getElementById("mainSection").innerHTML = "<div class='countrylabel'>" + local[1].setFullCityName() + "</div>" +
                                                         HTML_CityDetais(cityId)
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
    result += "<div class='countrydetail'><b>Координаты:</b> <a title='Посмотреть на карте' href='https://www.google.com/maps/@" + city.lat + "," + city.long + ",12z' target='_blank'>" +
              				city.lat + " с.ш. " + city.long + " в.д.</a></div>";

    //City description
    result += "<div class='countrydetail'><b>Описаниие:</b> " + city.description + "</div>";

    //Date of city visit
    var visitsList = "";
//			for (var d = 0; d < ArrayOfVisitsSorted.length; d++) {
//                if (ArrayOfVisitsSorted[d].id == countryId && ArrayOfVisitsSorted[d].place.indexOf(cityId) > -1) {
//				    var Day = ArrayOfVisitsSorted[d].date.getDate();
//                    var Month = ArrayOfVisitsSorted[d].date.getMonth();
//                    var Year = ArrayOfVisitsSorted[d].date.getFullYear();
//                    var VisitDateToShow = Day + " " + russianMonth(Month) + " " + Year;
//				    visitsList += VisitDateToShow + "; "
//				}
//			}
    result += "<div class='countrydetail'><b>Дата посещения:</b> " + visitsList + "</div>";

    //Create list of pictures
    var imagesList = "";
    if (city.image != ""){
        imagesList += "<b>Фото:</b><br>";
        $.each (city.image.split(","), function( i, image ){
            imagesList += "<img src='IMG/" + image + "' class='city_photo img-thumbnail' />"
        });
    }
    result += "<div class='countrydetail'>" + imagesList + "</div>";

    return result;
}