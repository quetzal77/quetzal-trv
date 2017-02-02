//00.01 Run function on load of World page
//This is jQuery object that take data from xml and transform them to some collections
window.onload = function() {
     $.getJSON( "DATA/v.json", processMyJson);
 };

 var processMyJson = function(result){
    data = result;
    //List of unique IDs of visited countries
    //countriesVisitedIDs = createArrayOfIDsVisitedCountries();
    //List of unique Visited Countries
    //visitedCountriesFull = createArrayOfVisitedCountries();
    //Array of visits sorted descendently and with dates in DATETIME format
    //visitsSorted = createArrayOfVisites();
 }

//00.02 List of unique IDs of visited countries
// function createArrayOfIDsVisitedCountries() {
//     result = [];
//     var distinctIds = {};
//     var distinctCities = {};
//     for (var i = 0; i < data.visit.length; i++) {
//         if (data.visit[i].country_id && data.visit[i].city){
//             var arrayOfCountries = {};
//             var cities = data.visit[i].city.split(" ");
//             if (!distinctIds[data.visit[i].country_id]) {
//                 arrayOfCountries.ID = data.visit[i].country_id;
//                 distinctIds[data.visit[i].country_id] = true;
//                     for (var j = 0; j < cities.length; j++){
//                         if (!distinctCities[cities[j]] && cities[j] != undefined){
//                             arrayOfCountries.cities.push(cities[j]);
//                             distinctCities[cities[j]];
//                         }
//                     }
//                 result.push(arrayOfCountries)
//             }
////             else{
////
////             }
//         }
//     }
//     return result;
// }

//00.03 Object that contain list if visited countries with their attributes like continent etc so we will be able create html code to display them
//function createArrayOfVisitedCountries() {
//    result = [];
//    for (var i = 0; i < ArrayOfVisitedCountriesIDs.length; i++) {
//        country = {};
//        for (var j = 0; j < countries.length; j++) {
//            if (ArrayOfVisitedCountriesIDs[i] == countries[j].id) {
//                country.contId = countries[j].cont;
//                country.countryName = countries[j].ident;
//                country.nameRu = countries[j].nameru;
//                country.nameEn = countries[j].nameen;
//                country.nameNt = countries[j].nament;
//                country.id = countries[j].id;
//
//                var visitPlaces = [];
//                for (var j = 0; j < visites.length; j++){
//                    if (visites[j].id == ArrayOfVisitedCountriesIDs[i] && visites[j].place){
//                        visitPlaces.push.apply (visitPlaces, visites[j].place.split(" "));
//                    }
//                }
//                var uniqueVisitedPlaces = [];
//                for (var s = 0; s < visitPlaces.length; s++) {
//                    if (uniqueVisitedPlaces.indexOf(visitPlaces[s]) == -1) {
//                        uniqueVisitedPlaces.push(visitPlaces[s]);
//                    }
//                }
//                country.visitedCitiesList = uniqueVisitedPlaces;
//
//                var visitedRegion = [];
//                for (var f = 0; f < uniqueVisitedPlaces.length; f++){
//                    for (var g = 0; g < cities.length; g++){
//                        if (uniqueVisitedPlaces[f] == cities[g].id){
//                            visitedRegion.push (cities[g].mc_name);
//                        }
//                    }
//                }
//                var uniqueVisitedRegions = [];
//                for (var h = 0; h < visitPlaces.length; h++) {
//                    if (uniqueVisitedRegions.indexOf(visitedRegion[h]) == -1) {
//                        if (visitedRegion[h] != undefined) {
//                            uniqueVisitedRegions.push(visitedRegion[h]);
//                        }
//                    }
//                }
//                country.visitedRegionsList = uniqueVisitedRegions;
//
//                result.push(country);
//                break;
//            }
//        }
//
//    }
//    result.sort(dynamicSort("nameRu"));
//    return result;
//}

//00.04 Array of visits sorted descendently and with dates in DATETIME format
// function createArrayOfVisites() {
//     result = [];
//     var distinctIds = {};
//     for (var i = 0; i < data.visit.length; i++) {
//         if (data.visit[i].start_date != undefined && data.visit[i].end_date != undefined && data.visit[i].country_id != undefined && data.visit[i].city != undefined){
//             var arrayOfVisits = {};
//             arrayOfVisits.country_id = data.visit[i].country_id;
//             arrayOfVisits.photos = data.visit[i].photos;
//             arrayOfVisits.story = data.visit[i].story;
//             arrayOfVisits.city = data.visit[i].city.split(" ");
//
//             var starVisit = data.visit[i].start_date.split(".");
//             arrayOfVisits.start_date = new Date(starVisit[2],starVisit[1]-1,starVisit[0]);
//
//             var endVisit = data.visit[i].end_date.split(".");
//             arrayOfVisits.end_date = new Date(endVisit[2], endVisit[1] - 1, endVisit[0]);
//
//             result.push(arrayOfVisits);
//         }
//     }
//     result.sort(dynamicSort("start_date"));
//     result.reverse();
//     return result
// }