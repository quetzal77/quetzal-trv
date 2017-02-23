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
    return (number >20) ? number.toString()[number.toString().length-1]*1 : number;
}

//02.03 Return correctly created string like "31 страна"
function parseWord (word, end1, end234, endrest, number){
    var result = "";
    var endOfWord = endrest;
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
    return number + " " + parseWord (wordBody, end1, end234, endrest, number)
}

//02.05 Return russian word "location" with correct end
function setLocationNumberWithCorrectEnd (number) {
    var wordBody = "локаци";
    var end1 = "я";
    var end234 = "и";
    var endrest = "й";
    var newNumber = processEntityNumber  (number)
    return number + " " + parseWord (wordBody, end1, end234, endrest, number)
}

//02.08 Return russian month name
function getRusMonthName (number) {
    var monthSList = {0: "января", 1: "февраля", 2: "марта", 3: "апреля", 4: "мая", 5: "июня", 6: "июля", 7: "августа", 8: "сентября", 9: "октября", 10: "ноября", 11: "декабря"};
    var MonthKeys = Object.keys(monthSList);
    return $.grep (MonthKeys, function( n, i ) {return (n == number)});
}

//2.13 Get russian country name
function getRusCountryName(countryId) {
    result = $.grep (countriesVisited, function( n, i ) {
                return (n.country_id == countryId)
            });
    return result.name_ru;
}

//2.16 Get russian Location name
function getRusLocationName(locationId) {
    result = $.grep (citiesVisited, function( n, i ) {
                return (n.city_id == locationId)
            });
    return result.name_ru;
}