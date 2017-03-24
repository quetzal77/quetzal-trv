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

//02.02 Sorting of objects in array by attribute
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

//02.03 Return correctly created string like "31 страна"
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

//02.04 Return russian word "country" with correct end
function setCountriesNumberWithCorrectEnd (number) {
    var wordBody = "стран";
    var end1 = "а";
    var end234 = "ы";
    var endrest = "";
    return number + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.05 Return russian word "location" with correct end
function setLocationNumberWithCorrectEnd (number) {
    var wordBody = "локаци";
    var end1 = "я";
    var end234 = "и";
    var endrest = "й";
    return number + " " + parseWord (wordBody, end1, end234, endrest, number);
}

//02.06 Return russian month name
function getRusMonthName (number) {
    var monthSList = {0: "января", 1: "февраля", 2: "марта", 3: "апреля", 4: "мая", 5: "июня", 6: "июля", 7: "августа", 8: "сентября", 9: "октября", 10: "ноября", 11: "декабря"};
    var MonthKeys = Object.keys(monthSList);
    return $.grep (MonthKeys, function( n, i ) {return (n == number)});
}

//2.07 Get russian country name
function getRusCountryName(countryId) {
    result = $.grep (countriesVisited, function( n, i ) {
                return (n.country_id == countryId)
            });
    return result.name_ru;
}

//2.08 Get russian Location name
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
