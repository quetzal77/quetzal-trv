//02.00 Services
//This file contains all the functions shared among all the other functions, so we can't use them for any another one function's file

//02.01 Sorting of objects in array by attribute
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

//02.02 Return last digit of number so then it's possible to create russian words correctly
function processEntityNumber (number) {
    var result;
    if (number >20) {
        var x = number.toString()
        result = x[x.length-1]*1;
    }
    else{
        result = number
    }
    return result
}

//02.03 Return correctly created string like "31 страна"
function parseWord (word, end1, end234, endrest, number){
    var result = "";
    var endOfWord= endrest;
    var newNumber = processEntityNumber (number)

    if (newNumber == 1){
        endOfWord = end1;
    }
    else {
        if (newNumber == 2 || newNumber == 3 || newNumber == 4){
            endOfWord = end234;
        }
    }
    result += word + endOfWord
    return result
}

//02.04 Return russian word "country" with correct end
function setCountriesNumberWithCorrectEnd (number) {
    var wordBody = "стран";
    var end1 = "а";
    var end234 = "ы";
    var endrest = "";
    var newNumber = processEntityNumber  (number)

    var result = number + " " + parseWord (wordBody, end1, end234, endrest, number)
    return result
}

//02.05 Return russian word "location" with correct end
function setLocationNumberWithCorrectEnd (number) {
    var wordBody = "локаци";
    var end1 = "я";
    var end234 = "и";
    var endrest = "й";
    var newNumber = processEntityNumber  (number)

    var result = number + " " + parseWord (wordBody, end1, end234, endrest, number)
    return result
}

//02.08 Return russian month name
function getRusMonthName (number) {
    var result;
    var monthSList = {0: "января", 1: "февраля", 2: "марта", 3: "апреля", 4: "мая", 5: "июня", 6: "июля", 7: "августа", 8: "сентября", 9: "октября", 10: "ноября", 11: "декабря"};
    var MonthKeys = Object.keys(monthSList);
    for (var d = 0; d < MonthKeys.length; d++){
        if (MonthKeys[d] == number){
            result = monthSList[d];
            break;
        }
    }
    return result
}

//2.13 Get russian country name
function getRusCountryName(countryId) {
    for (var i = 0; i < countriesVisited.length; i++) {
        if (countriesVisited[i].country_id == countryId) {
            var result = countriesVisited[i].name_ru;
            break;
        }
    }
    return result;
}

//2.16 Get russian Location name
function getRusLocationName(locationId) {
    for (var i = 0; i < citiesVisited.length; i++) {
        if (citiesVisited[i].city_id == locationId) {
            var result = citiesVisited[i].name_ru;
            break;
        }
    }
    return result;
}