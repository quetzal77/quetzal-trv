//02.00 Services
//This file contains all the functions shared among all the other functions, so we can't use them for any another one function's file

//02.01 Create new AMMAP's map
function drawMap(){
     $.getScript("SCRIPTS/MAPS/ammap.js");
     $.getScript("SCRIPTS/MAPS/custommap.js");
     $.getScript("SCRIPTS/MAPS/" + local[0] + "Low.js", function(){
     $('#mapdiv').removeClass('loading');
     $('#mapdiv').addClass('map');
     CreateMap(local[1]);
     });
 }

 //02.02 This method creates list of visits
 function createListOfVisites(){
      var result = "";

      switch (local[0]) {
          case "world":
              result = createCustomListOfVisites(visitsSorted);
              break;
          case "country":
              result = createCustomListOfVisites(visitsSorted);
              break;
          case "city":
              break;
      }

      return result;
 }

 var VisitYear;

 //02.03 This method creates CUSTOM list of visits
 function createCustomListOfVisites(visitesList){
     //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
     //         <div class="secondcell float_l"><a href="countries.aspx?country=poland" id="25,52,19.5;Katowice,50.2599736,19.0284561;Wroclaw,51.122489,17.026062;Swidnica,50.8403152,16.4935923;Ksiaz,50.8440566,16.2897844;Opole,50.6780534,17.9175784;" onmouseover="CreateMap(this.id)" onmouseout="CreateMap('none')">Катовице, Вроцлав, Свидница, Кщёнж, Ополе (Польша)</a></div>
     //         <br class="clear">
     var result = "";

     $.each (visitesList, function( i, visit ) {
         //This section sets year

         if (visit.start_date.getFullYear() != VisitYear) {
             VisitYear = visit.start_date.getFullYear();
             result += "<div class='visityear clear'>" + VisitYear + "</div>";
         }

         //This section is responsible to create date section
         //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
         if (visit.start_date.toDateString() == visit.end_date.toDateString()) {
             result += "<div class='firstcell float_l'>" + visit.start_date.getDate() + " " +
                       getRusMonthName(visit.start_date.getMonth() + 1) + "</div>"
         }
         else {
             result += "<div class='firstcell float_l'>" +
                 visit.start_date.getDate() + " " +
                 getRusMonthName(visit.start_date.getMonth() + 1) + " - " +
                 visit.end_date.getDate() + " " +
                 getRusMonthName(visit.end_date.getMonth() + 1) + "</div>"
         }

         //This section is responsible for displaying list of visited cities and countries
         var citiesLink = "";
         var countryLink = "";
         var distinctIds = {};
         $.each (visit.cities, function( j, city ) {
             citiesLink += "<a id='" + city.city_id + "' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                           getRusLocationName(city.city_id) + "</a>" + ", ";

             if (!distinctIds[city.country_id]){
                 countryLink += "<a id='" + city.country_id + "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                           getRusCountryName(city.country_id) + "</a>" + ", ";
                 distinctIds[city.country_id] = true;
             }
         });

         result += "<div class='secondcell float_l'>" + citiesLink.slice(0, -2) + " (" + countryLink.slice(0, -2) + ")</div>";
         //Can be added to display a city on the map: onmouseover='CreateMap(this.id)' onmouseout=\"CreateMap('none')\"
         //"' id='" + zoomLat + "," + zoomLong + "," + zoomLvl + ";" + citiesCoordinates +
         result += "<br class='clear'>";
     });
     return result;
  }

//02.04 Sorting of objects in array by attribute
    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

//02.05 Return correctly created string like "31 страна"
function parseWord (word, end1, end234, endrest, number){
    var endOfWord = endrest;
    //Returns last digit of number so then it's possible to create russian words correctly
    var newNumber = (number >20) ? number.toString()[number.toString().length-1]*1 : number;

    if (newNumber == 1){
        endOfWord = end1;
    }
    else if (newNumber == 2 || newNumber == 3 || newNumber == 4){
        endOfWord = end234;
    }
    return word + endOfWord;
}

//02.06 Return russian word "country" with correct end
function setCountriesNumberWithCorrectEnd (number) {
    var wordBody = "стран";
    var end1 = "а";
    var end234 = "ы";
    var endrest = "";
    return number + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.07 Return russian word "location" with correct end
function setLocationNumberWithCorrectEnd (number) {
    var wordBody = "локаци";
    var end1 = "я";
    var end234 = "и";
    var endrest = "й";
    return number + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.08 Return russian word "region" with correct end
function setRegionsNumberWithCorrectEnd (number) {
    var word = "регион";
    var end1 = "";
    var end234 = "а";
    var endrest = "ов";
    return number + " " + parseWord  (word, end1, end234, endrest, number);
}

//02.09 Return russian month name
function getRusMonthName (number) {
    var monthSList = {1: "января", 2: "февраля", 3: "марта", 4: "апреля", 5: "мая", 6: "июня", 7: "июля", 8: "августа", 9: "сентября", 10: "октября", 11: "ноября", 12: "декабря"};
    return monthSList[number];
}

//2.10 Get russian country name
function getRusCountryName(countryId) {
    result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });
    return result[0].name_ru;
}

//2.11 Get full country name
function getFullCountryName(countryId) {
    result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });
    return result[0].setFullCountryName();
}

//2.12 Get russian Location name
function getRusLocationName(locationId) {
    result = $.grep (citiesVisited, function( n, i ) {
                return (n.city_id == locationId)
            });
    return result[0].name_ru;
}

//02.13 This method creates selector of countries
function getSelectorOfListOfCountries_HTML () {
    var result = "";
    $.each (countriesVisited, function( i, country ) {
        result += "<li><a id='" + country.short_name + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + country.name_ru + "</a></li>";
    });
    result += "</select>";
    return result;
}

//02.14 This method creates selector of cities
function getSelectorOfListOfCities_HTML(){
    var result = "";
    $.each (countriesVisited, function( i, country ){
        result += "<li class='dropdown-header'>" + country.name_ru + "</li>";

        var citiesList = $.grep (citiesVisited, function( n, i ) {
                                         return (n.getCountryId() == country.short_name)
                                     });

        $.each (citiesList, function( i, city ){
            result += "<li><a id='" + city.city_id + "' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>&nbsp;&nbsp;&nbsp;&nbsp;" + city.name_ru + "</a></li>";
        });
    });
    return result;
}

//02.15 This method creates selector of stories
function HTML_SelectorListOfStories(){
    var result = "";
    var storiesArrayList = [];
    var storiesTextList = "пусто";
    var ListOfStories;
    for (var s = 0; s < visites.length; s++) {
        if (visites[s].story != "" && visites[s].story != null) {
            var storyDate = visites[s].date.split(".")
            var storyMonth = storyDate[1]-1;

            if (storyDate[1].charAt(0) == 0) {
                storyMonth = storyDate[1].substring(1, 2)-1;
            }

            if (visites[s].story == 1) {
                storiesTextList += "<li><a title='Перейти к истории' id='" + visites[s].id + visites[s].date +
						           "' onmouseover='' style='cursor: pointer;' onclick='javascript:HTML_CreatorOfStoryPage(this.id)'>" +
                                   storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + HTML_ShortCountryName(CountryNameReturner(visites[s].id)) + "</a></li>";
            }
			else {
			    if (visites[s].story != 2) {
                storiesTextList += "<li><a title='Перейти к истории' href='" + visites[s].story + "' target='_blank'>" +
                                   storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + HTML_ShortCountryName(CountryNameReturner(visites[s].id)) + "</a></li>";
                }
			}
            //else {
            //    storiesTextList += "<li><a title='Перейти к истории' id='" + visites[s].story2 +
			//			           "' onmouseover='' style='cursor: pointer;' onclick='javascript:HTML_CreatorOfStoryPage(this.id)'>" +
            //                       storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + HTML_ShortCountryName(CountryNameReturner(visites[s].id)) + "</a></li>";
            //}


        }
    }

    if (storiesTextList.length > 5) {
        ListOfStories = storiesTextList.substring(5, storiesTextList.length);
    }
    else {
        ListOfStories = storiesTextList;
    }

    return result += ListOfStories;
}

//03.00 Basic functions
//Here are page objects that used for each page shown

//03.01 Creator of Contact page
function HTML_CreatorOfContactPage (){
    document.getElementById("mainSection").innerHTML = "<div class='jumbotron'>" +
        "<h2><b> Контакты </b></h2>" +
        "<p> Location: Kyiv, Ukraine </p>" +
        "<p> Email: <a href='mailto:coatls77@gmail.com'>coatls77@gmail.com</a></p>" +
        "<p> Skype: slavutskyy </p>" +
        "</div>";
}

//03.02 Creator of About page
function HTML_CreatorOfAboutPage () {
    document.getElementById("mainSection").innerHTML = "<div class='well'>" +
          "<h2><b> О проекте </b></h2>" +
          "<p><b>Version</b>: 8.0.1</p>" +
          "<p><b>Compatibility Google Chrome</b>: 1.0+ </p>" +
          "<p><b>Compatibility Internet Explorer</b>: 8.0+</p>" +
          "<p><b>Technologies</b>: HTML, CSS, XML, Json, JScript, <a href='http://www.amcharts.com/javascript-maps/' target='_blank'>AMMAP (maps)</a>," +
          " <a href='http://getbootstrap.com/' target='_blank'>Bootstrap (themes)</a>.</p>" +
          "<p>Здравствуйте. Мое имя Славутский Алексей и это мой личный сайт. Существует множество подобных сайтов, но этот мой! " +
          "Здесь собрана вся информация о моих путешествиях. Тут вы можете найти фотографии, отчеты о поездках, список посещенных мною территорий и еще многое о моем увлечении туризмом. " +
          "Вся информация, содержащаяся на сайте и сам этот сайт - результаты моей многолетней работы и поездок. Изначально был просто список стран в файле Word, который со временем, " +
          "благодаря моему увлечению интернетом и сопутствующими ему технологиями превратился в то, что вы видите перед собой. Не знаю, куда заведет меня эта дорога, но рад буду это выяснить. " +
          "Вот и все что я хотел сказать.</p>" +
          "<p>Приятного просмотра!</p></div>";
}

//03.03 Navigation to SignIn page
function HTML_SignInPage () {
	var url = "settings.html";
	location.href = url;
}
