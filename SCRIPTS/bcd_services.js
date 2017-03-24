//02.00 Services
//This file contains all the functions shared among all the other functions, so we can't use them for any another one function's file

//02.01 Create new AMMAP's map
function drawMap(){
     $.getScript("SCRIPTS/MAPS/ammap.js");
     $.getScript("SCRIPTS/MAPS/custommap.js");
     $.getScript("SCRIPTS/MAPS/" + local + "Low.js", function(){
         if (local == "world") {local = "none"};
         $('#mapdiv').removeClass('loading');
         CreateMap(local);
     });
 }

 //02.02 This method creates list of worlds visits
 function createListOfVisites(){
     //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
     //         <div class="secondcell float_l"><a href="countries.aspx?country=poland" id="25,52,19.5;Katowice,50.2599736,19.0284561;Wroclaw,51.122489,17.026062;Swidnica,50.8403152,16.4935923;Ksiaz,50.8440566,16.2897844;Opole,50.6780534,17.9175784;" onmouseover="CreateMap(this.id)" onmouseout="CreateMap('none')">Катовице, Вроцлав, Свидница, Кщёнж, Ополе (Польша)</a></div>
     //         <br class="clear">
     var result = "";

     for (var a = 0; a < visitsSorted.length; a++) {
         //This section sets year
         result += "<div class='visityear clear'>" + visitsSorted[a].start_date.getFullYear() + "</div>";

         //This section is responsible to create date section
         //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
         if (visitsSorted[a].start_date.toDateString() == visitsSorted[a].end_date.toDateString()) {
             result += "<div class='firstcell float_l'>" + visitsSorted[a].start_date.getDate() + " " +
                       getRusMonthName(visitsSorted[a].start_date.getMonth()) + "</div>"
         }
         else {
             result += "<div class='firstcell float_l'>" + visitsSorted[a].start_date.getDate() + " " + getRusMonthName(visitsSorted[a].start_date.getMonth()) + " - " +
                       visitsSorted[a].end_date.getDate() + " " + getRusMonthName(visitsSorted[a].end_date.getMonth()) + "</div>"
         }

         //This section is responsible for displaying list of visited cities and countries
         var citiesLink = "";
         var countryLink = "";
         var distinctIds = {};
         for (var b = 0; b < visitsSorted[a].cities.length; b++) {
             for (var c = 0; c < citiesVisited.length; c++) {
                 if (citiesVisited[c].city_id == visitsSorted[a].cities[b]) {
                     citiesLink += "<a id='" + visitsSorted[a].cities[b] + "' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                   getRusLocationName(citiesVisited[c].name_ru) + "</a>" + ", ";

                     for (var d = 0; d < regionsVisited.length; d++){
                         if (regionsVisited[d].region_id == citiesVisited[c].region_id && !distinctIds[regionsVisited[d].country_id]){
                             countryLink += "<a id='" + regionsVisited[d].country_id + "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                             getRusCountryName(regionsVisited[d].country_id) + "</a>" + ", ";
                             distinctIds[regionsVisited[d].country_id] = true;
                         }
                         break;
                     }
                     break;
                 }
             }
         }

         result += "<div class='secondcell float_l'>" + citiesLink.slice(0, -2) + " (" + countryLink.slice(0, -2) + " )</div>";
         //Can be added to display a city on the map: onmouseover='CreateMap(this.id)' onmouseout=\"CreateMap('none')\"
         //"' id='" + zoomLat + "," + zoomLong + "," + zoomLvl + ";" + citiesCoordinates +
         result += "<br class='clear'>";
     }
     return result;
  }

//02.03 Sorting of objects in array by attribute
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

//02.04 Return correctly created string like "31 страна"
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

//02.05 Return russian word "country" with correct end
function setCountriesNumberWithCorrectEnd (number) {
    var wordBody = "стран";
    var end1 = "а";
    var end234 = "ы";
    var endrest = "";
    return number + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.06 Return russian word "location" with correct end
function setLocationNumberWithCorrectEnd (number) {
    var wordBody = "локаци";
    var end1 = "я";
    var end234 = "и";
    var endrest = "й";
    return number + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.07 Return russian month name
function getRusMonthName (number) {
    var monthSList = {0: "января", 1: "февраля", 2: "марта", 3: "апреля", 4: "мая", 5: "июня", 6: "июля", 7: "августа", 8: "сентября", 9: "октября", 10: "ноября", 11: "декабря"};
    var MonthKeys = Object.keys(monthSList);
    return $.grep (MonthKeys, function( n, i ) {return (n == number)});
}

//2.08 Get russian country name
function getRusCountryName(countryId) {
    result = $.grep (countriesVisited, function( n, i ) {
                return (n.country_id == countryId)
            });
    return result.name_ru;
}

//2.09 Get russian Location name
function getRusLocationName(locationId) {
    result = $.grep (citiesVisited, function( n, i ) {
                return (n.city_id == locationId)
            });
    return result.name_ru;
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
