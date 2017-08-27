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

//07.02 Creation of Name section
function HTML_CityName(cityId) {
    var result = "<div class='countrylabel'>" + HTML_FullLocationName(cityId) + "</div>";
    return result;
}

//07.02 Creation of
function HTML_CityDetais(cityId) {
    var result;
//    var capital = "";
//	var countryId = "test";
//	for (var a = 0; a < cities.length; a++) {
//        if (cities[a].id == cityId) {
//		    //Capital identificator
//		    if (cities[a].capital_city == "true") {capital = "<div class='countrydetail'><b>Столица:</b> <img src='IMG/icon/crown.png' class='crown' /></div>"}
//
//			//Search for country id
//			for (var b = 0; b < areas.length; b++) {
//                if (cities[a].mc_name == areas[b].mc_name) {
//				    countryId = areas[b].id}
//			}
//
//			//Create list of pictures
//			var imagesList = "";
//			if (cities[a].img != ""){
//			    var imagesArray = cities[a].img.split(",");
//				imagesList += "<b>Фото:</b><br>";
//			    for (var c = 0; c < imagesArray.length; c++) {
//                    imagesList += "<img src='IMG/" + imagesArray[c] + "' class='city_photo img-thumbnail' />"
//			    }
//			}
//
//			//Create list of dates of visit
//			var visitsList = "";
//			for (var d = 0; d < ArrayOfVisitsSorted.length; d++) {
//                if (ArrayOfVisitsSorted[d].id == countryId && ArrayOfVisitsSorted[d].place.indexOf(cityId) > -1) {
//				    var Day = ArrayOfVisitsSorted[d].date.getDate();
//                    var Month = ArrayOfVisitsSorted[d].date.getMonth();
//                    var Year = ArrayOfVisitsSorted[d].date.getFullYear();
//                    var VisitDateToShow = Day + " " + russianMonth(Month) + " " + Year;
//				    visitsList += VisitDateToShow + "; "
//				}
//			}
//
//			result= "<div class='countrydetail'><b>Страна:</b> <a id='" + CountryNameReturner(countryId) + "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
//			     HTML_FullCountryName(CountryNameReturner(countryId)) + "</a></div>" +
//                 "<div class='countrydetail'><b>Регион:</b> " + HTML_FullRegionName(countryId, cities[a].mc_name) + "</div>" +
//                 capital +
//                 "<div class='countrydetail'><b>Координаты:</b> <a title='Посмотреть на карте' href='https://www.google.com/maps/@" + cities[a].lat + "," + cities[a].long + ",12z' target='_blank'>" +
//				 cities[a].lat + " с.ш. " + cities[a].long + " в.д.</a></div>" +
//                 "<div class='countrydetail'><b>Описаниие:</b> " + cities[a].description + "</div>" +
//                 "<div class='countrydetail'><b>Дата посещения:</b> " + visitsList + "</div>" +
//                 "<div class='countrydetail'>" + imagesList + "</div>";
//			break;
//		}
//	}
    return result;
}