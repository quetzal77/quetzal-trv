//02.00 Services
//This file contains all the functions shared among all the other functions, so we can't use them for any another one function's file

//02.01 Create new AMMAP's map
function drawMap(){
     $.getScript("SCRIPTS/MAPS/ammap.js", function() {
         $.getScript("SCRIPTS/MAPS/custommap.js", function() {
             $.getScript("SCRIPTS/MAPS/" + local[0] + "Low.js", function() {
                 $('#mapdiv').removeClass('loading');
                 $('#mapdiv').addClass('map');
                 CreateMap();
             });
         });
     });
}

//02.02 This method creates CUSTOM list of visits
function createListOfVisites(){
     //EXAMPLE: <div class="firstcell float_l">10.июля - 19.июля</div>
     //         <div class="secondcell float_l"><a href="countries.aspx?country=poland" id="25,52,19.5;Katowice,50.2599736,19.0284561;Wroclaw,51.122489,17.026062;Swidnica,50.8403152,16.4935923;Ksiaz,50.8440566,16.2897844;Opole,50.6780534,17.9175784;" onmouseover="CreateMap(this.id)" onmouseout="CreateMap('none')">Катовице, Вроцлав, Свидница, Кщёнж, Ополе (Польша)</a></div>
     //         <br class="clear">
     var result = "";
     var VisitYear;
     var VisitYear_HTML = "";

     $.each (visitsSorted, function( i, visit ) {
         //This section sets year
         if (visit.start_date.getFullYear() != VisitYear) {
            VisitYear = visit.start_date.getFullYear();
            VisitYear_HTML = "<div class='visityear clear'>" + VisitYear + "</div>";
         }

         //This section is responsible to create date section
         var VisitDate = "<div class='firstcell float_l'>" + getVisitDate (visit.start_date, visit.end_date).slice(0, -3) + "</div>";

         //This section is responsible for displaying list of visited cities and countries
         switch (local[1].type) {
             case "country":
                 var citiesToReturn = "";
                 $.each (visit.cities, function( i, city ){
                     if (city.country_id == local[1].short_name) {
                         citiesToReturn += "<a id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                           getRusLocationName(city.city_id) + "</a>" + ", "
                     }
                 });
                 if (citiesToReturn != "") {
                    result += VisitYear_HTML;
                    result += VisitDate + "<div class='secondcell float_l'>" + citiesToReturn.slice(0, -2) + "</div><br class='clear'>";
                    VisitYear_HTML = "";
                 }
                 break;
             case "city":
                 var citiesToReturn = "";
                 var distinctIds = {};
                 $.each (visit.cities, function( i, city ){
                    if (city.city_id == local[1].city_id) {
                        var date = getVisitDate (visit.start_date, visit.end_date, "year");
                        if (!distinctIds[date]){
                            result += date;
                            distinctIds[date] = true;
                        }
                    }
                 });
                 break;
             default:
                 var citiesToReturn = "";
                 var countriesToReturn = "";
                 var distinctIds = {};

                 result += VisitYear_HTML ;

                 $.each (visit.cities, function( i, city ){
                     citiesToReturn += "<a id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                      getRusLocationName(city.city_id) + "</a>" + ", ";
                     if (!distinctIds[city.country_id]){
                         countriesToReturn += "<a id='" + city.country_id + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" +
                                      getRusCountryName(city.country_id) + "</a>" + ", ";
                         distinctIds[city.country_id] = true;
                     }
                 });
                 result += VisitDate + "<div class='secondcell float_l'>" + citiesToReturn.slice(0, -2) + " (" + countriesToReturn.slice(0, -2) + ")</div><br class='clear'>";
                 VisitYear_HTML = "";
         }

         //Can be added to display a city on the map: onmouseover='CreateMap(this.id)' onmouseout=\"CreateMap('none')\"
         //"' id='" + zoomLat + "," + zoomLong + "," + zoomLvl + ";" + citiesCoordinates +
     });
     return result;
}

//02.03 Get Visit date
function getVisitDate(start_date, end_date, year){
    var VisitDateToShow = "";
    var StartDay = start_date.getDate();
    var StartMonth = start_date.getMonth() + 1;
    var StartYear = "";
    var EndDay = end_date.getDate();
    var EndMonth = end_date.getMonth() + 1;
    var EndYear = "";

    if (year) {
        StartYear = start_date.getFullYear();
        EndYear = end_date.getFullYear();
    }

    if (StartDay+StartMonth == EndDay+EndMonth) {
        VisitDateToShow += StartDay + " " + getRusMonthName(StartMonth) + "." + EndYear + "; ";
    }
    else if (StartYear == EndYear) {
        VisitDateToShow = StartDay + " " + getRusMonthName(StartMonth) + " - " + EndDay + " " + getRusMonthName(EndMonth) + "." + EndYear + "; ";
    }
    else {VisitDateToShow = StartDay + " " + getRusMonthName(StartMonth) + "." + StartYear + " - " + EndDay + " " + getRusMonthName(EndMonth) + "." + EndYear + "; "}

    return VisitDateToShow;
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

//2.11 Get full russian country name
function getFullRusCountryName(countryId) {
    result = $.grep (countriesVisited, function( n, i ) {
                return (n.short_name == countryId)
            });

    if (result[0].name_nt == "") {
        result = result[0].name_ru + " - " + result[0].name;
    }
    else if (result[0].name_ru == "") {
        result = result[0].name_nt + " - " + result[0].name;
    }
    else if (result[0].name == "") {
        result = result[0].name_ru + " - " + result[0].name_nt;
    }
    else {
        result = result[0].name_ru + " - " + result[0].name_nt + " - " + result[0].name;
    }

    return result;
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
            result += "<li><a id='" + city.city_id + "' onclick='javascript:getCityPage(this.id)' onmouseover='' style='cursor: pointer;'>&nbsp;&nbsp;&nbsp;&nbsp;" + city.name_ru + "</a></li>";
        });
    });
    return result;
}

//02.15 This method creates selector of stories
function getSelectorOfListOfStories_HTML(){
    var result = "";

    $.each (visitsSorted, function( i, visit ){
        var countriesToReturn = "";
        var countriesIDToReturn = "";
        var distinctIds = {};

        if (visit.story != "" && visit.story != null && visit.story != undefined){
            $.each (visit.cities, function( i, city ){
                if (!distinctIds[city.country_id]){
                 countriesToReturn += getRusCountryName(city.country_id) + ", ";
                 countriesIDToReturn += city.country_id;
                 distinctIds[city.country_id] = true;
                }
            });
            var StartMonth = visit.start_date.getMonth() + 1;

            var url = (visit.story == true) ? "id='" + visit.start_date.getFullYear() + StartMonth + visit.start_date.getDate() + countriesIDToReturn + "' onmouseover='' style='cursor: pointer;' onclick='javascript:getStoryPage(this.id)'"
                                            : "href='" + visit.story + "' target='_blank'";
            var text = (countriesToReturn.length > 27) ? countriesToReturn.slice(0, 25) + "..." : countriesToReturn.slice(0, -2);

            result += "<li><a " + url + ">" + getVisitDate(visit.start_date, visit.end_date, "year").slice(0, -2) + " - " + " " + text + "</a></li>";
        }
    });

    return result;
}

//02.16 Calculate number of locations visited
function getNumberOfLocation() {
    $.each(initial_data.continent, function( i, cont ){
        var numberOfCities = 0;
        $.each( countriesVisited, function( j, country ){
            if (country.continent_id == cont.continent_id) {
                //document.getElementById(country.short_name).firstElementChild.setAttribute("title", country.setFullCountryName() + " - " + setLocationNumberWithCorrectEnd(country.getNumberOfVisitedCities()));

                var countryElem = $("a#" + country.short_name).last().get(0);

                countryElem.firstElementChild.setAttribute("title", country.setFullCountryName() + " - " + setLocationNumberWithCorrectEnd(country.getNumberOfVisitedCities()));
                numberOfCities = numberOfCities + country.getNumberOfVisitedCities();
            }
        });
        document.getElementById("citiesNumberPerContinent" + cont.continent_id).innerHTML = " (" + setLocationNumberWithCorrectEnd(numberOfCities) + ")";
    });
    document.getElementById("totalCitiesNum").innerHTML = " (" + setLocationNumberWithCorrectEnd(citiesVisited.length) + ")";
}

//2.17 Remove all attributes by name
function removeAllAttributesByName(attrType, attrName) {
    var mylist=document.getElementsByClassName(attrName);
    for (j=0; j<mylist.length; j++) {
        mylist[j].removeAttribute(attrType);
    }
}

//2.18 Remove all child nodes
function removeAllChildNodes(attrId) {
    var list = document.getElementById(attrId);

    if (list == null) return;

    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    };
}

//2.19 Remove readonly attribute from Input field
function unblockReadonlyField(id){
    $("#" + id).removeAttr("readonly");
}

//2.20 Remove element from Array
function removeElementOfGlobalDataArray (arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){
           arr.splice(i,1);
       }
    }
}

//2.21 Reprocess all custom arrays and refresh scrolles
function refreshAllTheArrays (){
    //Reprocess all custom arrays
    processMyJson(data);
    //Creation of Country Selector
    document.getElementById("ContentBody_CountryList").innerHTML = getSelectorOfListOfCountries_HTML();
    //Creation of City Selector
    document.getElementById("ContentBody_CityList").innerHTML = getSelectorOfListOfCities_HTML();
    //Creation of Story Selector
    document.getElementById("ContentBody_StoryList").innerHTML = getSelectorOfListOfStories_HTML();
}

//2.22 Get country id instead of short name
function getCountryId(short_name) {
    result = $.grep (data.country, function( n, i ) {
                return (n.short_name == short_name)
            });
    return result[0].country_id;
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

//03.03 // When the user scrolls down 20px from the top of the document, show the button
    function scrollFunction() {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            document.getElementById("back").style.display = "block";
        } else {
            document.getElementById("back").style.display = "none";
        }
    }

//03.04 When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
