//04. Services
//04.01 Sorting of objects in array by attribute
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

//04.02 Return last digit of number so then it's possible to create russian words correctly
//function NumberProcessor (number) {
//    var result;
//    if (number >20) {
//        var x = number.toString()
//        result = x[x.length-1]*1;
//    }
//    else{
//        result = number
//    }
//    return result
//}

//04.03 Return correctly created string like "31 страна"
//function wordParser (word, end1, end234, endrest, number){
//    var result = "";
//    var endOfWord= endrest;
//    var newNumber = NumberProcessor (number)
//
//    if (newNumber == 1){
//        endOfWord = end1;
//    }
//    else {
//        if (newNumber == 2 || newNumber == 3 || newNumber == 4){
//            endOfWord = end234;
//        }
//    }
//    result += number + " "+ word + endOfWord
//    return result
//}

//04.04 Return russian word "country" with correct end
//function EndOfCountryWord (number) {
//    var word = "стран";
//    var end1 = "а";
//    var end234 = "ы";
//    var endrest = "";
//    var newNumber = NumberProcessor  (number)
//
//    var result = wordParser (word, end1, end234, endrest, number)
//    return result
//}

//04.05 Return russian word "location" with correct end
//function EndOfLocationWord (number) {
//    var word = "локаци";
//    var end1 = "я";
//    var end234 = "и";
//    var endrest = "й";
//    var newNumber = NumberProcessor  (number)
//
//    var result = wordParser (word, end1, end234, endrest, number)
//    return result
//}

//04.06 Return russian word "region" with correct end
//function EndOfRegionWord (number) {
//    var word = "регион";
//    var end1 = "";
//    var end234 = "а";
//    var endrest = "ов";
//    var newNumber = NumberProcessor  (number)
//
//    var result = wordParser (word, end1, end234, endrest, number)
//    return result
//}

//04.07 Return russian word "photoalbum" with correct end
//function EndOfPhotoalbumWord(number) {
//    var word = "фотоальбом";
//    var end1 = "";
//    var end234 = "а";
//    var endrest = "ов";
//    var newNumber = NumberProcessor(number)
//
//    var result = wordParser(word, end1, end234, endrest, number)
//    return result
//}

//04.08 Return russian month name
//function russianMonth (number) {
//    var result;
//    var monthSList = {0: "января", 1: "февраля", 2: "марта", 3: "апреля", 4: "мая", 5: "июня", 6: "июля", 7: "августа", 8: "сентября", 9: "октября", 10: "ноября", 11: "декабря"};
//    var MonthKeys = Object.keys(monthSList);
//    for (var d = 0; d < MonthKeys.length; d++){
//        if (MonthKeys[d] == number){
//            result = monthSList[d];
//            break;
//        }
//    }
//    return result
//}

//04.09 This method creates selector of countries
//function HTML_SelectorListOfCountries(){
//    var result = "";
//    for (var i = 0; i < ArrayOfVisitedCountries.length; i++){
//        result += "<li><a id='" + ArrayOfVisitedCountries[i].countryName + "' onclick='javascript:HTML_CreatorOfCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + ArrayOfVisitedCountries[i].nameRu + "</a></li>";
//    }
//    result += "</select>";
//    return result;
//}

//04.10 This method creates selector of cities
//function HTML_SelectorListOfCities(){
//    var result = "";
//    for (var i = 0; i < ArrayOfVisitedCountries.length; i++){
//        result += "<li class='dropdown-header'>" + ArrayOfVisitedCountries[i].nameRu + "</li>";
//
//        var citiesList = [];
//        for (var j = 0; j < ArrayOfVisitedCountries[i].visitedCitiesList.length; j++){
//            var cityElement = {};
//            cityElement.eng = ArrayOfVisitedCountries[i].visitedCitiesList[j]
//            for (var q = 0; q < cities.length; q++){
//                if (ArrayOfVisitedCountries[i].visitedCitiesList[j] == cities[q].id){
//                    cityElement.rus = cities[q].title_ru;
//                    break;
//                }
//            }
//            citiesList.push(cityElement);
//        }
//        citiesList.sort(dynamicSort("rus"));
//
//        for (var w = 0; w < citiesList.length; w++){
//            result += "<li><a id='" + citiesList[w].eng + "' onclick='javascript:HTML_CreatorOfCityPage(this.id)' onmouseover='' style='cursor: pointer;'>&nbsp;&nbsp;&nbsp;&nbsp;" + citiesList[w].rus + "</a></li>";
//        }
//    }
//    return result;
//}

//04.11 This method creates selector of stories
//function HTML_SelectorListOfStories(){
//    var result = "";
//    var storiesArrayList = [];
//    var storiesTextList = "пусто";
//    var ListOfStories;
//    for (var s = 0; s < visites.length; s++) {
//        if (visites[s].story != "" && visites[s].story != null) {
//            var storyDate = visites[s].date.split(".")
//            var storyMonth = storyDate[1]-1;
//
//            if (storyDate[1].charAt(0) == 0) {
//                storyMonth = storyDate[1].substring(1, 2)-1;
//            }
//
//            if (visites[s].story == 1) {
//                storiesTextList += "<li><a title='Перейти к истории' id='" + visites[s].id + visites[s].date +
//						           "' onmouseover='' style='cursor: pointer;' onclick='javascript:HTML_CreatorOfStoryPage(this.id)'>" +
//                                   storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + HTML_ShortCountryName(CountryNameReturner(visites[s].id)) + "</a></li>";
//            }
//			else {
//			    if (visites[s].story != 2) {
//                storiesTextList += "<li><a title='Перейти к истории' href='" + visites[s].story + "' target='_blank'>" +
//                                   storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + HTML_ShortCountryName(CountryNameReturner(visites[s].id)) + "</a></li>";
//                }
//			}
//            //else {
//            //    storiesTextList += "<li><a title='Перейти к истории' id='" + visites[s].story2 +
//			//			           "' onmouseover='' style='cursor: pointer;' onclick='javascript:HTML_CreatorOfStoryPage(this.id)'>" +
//            //                       storyDate[0] + " " + russianMonth(storyMonth) + " " + storyDate[2] + " " + HTML_ShortCountryName(CountryNameReturner(visites[s].id)) + "</a></li>";
//            //}
//        }
//    }
//
//    if (storiesTextList.length > 5) {
//        ListOfStories = storiesTextList.substring(5, storiesTextList.length);
//    }
//    else {
//        ListOfStories = storiesTextList;
//    }
//
//    return result += ListOfStories;
//}

//4.12 Full country name
//function HTML_FullCountryName(countryName) {
//    for (var i = 0; i < ArrayOfVisitedCountries.length; i++) {
//        if (ArrayOfVisitedCountries[i].countryName == countryName) {
//            var result = ArrayOfVisitedCountries[i].nameRu + " - " + ArrayOfVisitedCountries[i].nameNt + " - " + ArrayOfVisitedCountries[i].nameEn;
//            break;
//        }
//    }
//    return result;
//}

//4.13 Short country name
//function HTML_ShortCountryName(countryName) {
//    for (var i = 0; i < ArrayOfVisitedCountries.length; i++) {
//        if (ArrayOfVisitedCountries[i].countryName == countryName) {
//            var result = ArrayOfVisitedCountries[i].nameRu;
//            break;
//        }
//    }
//    return result;
//}

//4.14 Full Region name
//function HTML_FullRegionName(regionId, regionName) {
//    for (var i = 0; i < areas.length; i++) {
//        if (areas[i].id == regionId && areas[i].mc_name == regionName) {
//            var result = areas[i].title_ru + " - " + areas[i].title;
//            break;
//        }
//    }
//    return result;
//}

//4.15 Get full Location name
function getFullLocationName(locationId) {
    for (var i = 0; i < data.city.length; i++) {
        if (data.city[i].city_id == locationId) {
            var result = data.city[i].name_ru + " - " + data.city[i].name_nt + " - " + data.city[i].name;
            break;
        }
    }
    return result;
}

//4.16 Short Location name
function getRusLocationName(locationId) {
    for (var i = 0; i < data.city.length; i++) {
        if (data.city[i].city_id == locationId) {
            var result = data.city[i].name_ru;
            break;
        }
    }
    return result;
}

//4.17 Return country id instead of country name
//function CountryIdReturner(countryName) {
//    for (var i = 0; i < countries.length; i++) {
//        if (countries[i].ident == countryName) {
//            var result = countries[i].id;
//            break;
//        }
//    }
//    return result;
//}

//4.18 Return country name instead of country id
//function CountryNameReturner(countryId) {
//    for (var i = 0; i < countries.length; i++) {
//        if (countries[i].id == countryId) {
//            var result = countries[i].ident;
//            break;
//        }
//    }
//    return result;
//}

//4.19 Remove all attributes by name
//function removeAllAttributesByName(attrType, attrName) {
//    var mylist=document.getElementsByClassName(attrName);
//    for (j=0; j<mylist.length; j++) {
//        mylist[j].removeAttribute(attrType);
//    }
//}

//4.20 Remove all child nodes
//function removeAllChildNodes(attrId) {
//    var list = document.getElementById(attrId);
//    while (list.hasChildNodes()) {
//        list.removeChild(list.firstChild);
//    };
//}