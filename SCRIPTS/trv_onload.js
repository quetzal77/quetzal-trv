//00.01 Run function on load of World page
//This is jQuery object that take data from xml and transform them to some collections
window.onload = function() {
     $.getJSON( "DATA/globaldb.json", processMyJson);
 };

 var processMyJson = function(result){
    data = result;
    //Array of visits sorted descendently and with dates in DATETIME format
    //Plus array of all unique visited locations
    createArrayOfVisitesAndArrayOfUniqueCities();
    //Array of Visited Countries, Regions and Cities
    createArraysOfVisitedCountriesAndCities();
 }

//00.02 Array of visits sorted descendently and with dates in DATETIME format
 function createArrayOfVisitesAndArrayOfUniqueCities() {
     visitsSorted = []; //Array to be used for storing all of them visites happened
     uniqueVisitedPlaces = []; //Array to be used for storing all of the unique places so it would be possible to create array of visited countries
     var distinctIds = {};
     for (var i = 0; i < data.visit.length; i++) {
         if (data.visit[i].start_date != undefined && data.visit[i].end_date != undefined && data.visit[i].city != undefined){
             visitsSorted.push(new getVisitObject(data.visit[i].start_date, data.visit[i].end_date, data.visit[i].city, data.visit[i].photos, data.visit[i].story));
             for (var j = 0; j < data.visit[i].city.length; j++) {
                if (!distinctIds[data.visit[i].city[j]]) {
                    uniqueVisitedPlaces.push(data.visit[i].city[j]);
                    distinctIds[data.visit[i].city[j]] = true;
                }
             }
         }
     }
     visitsSorted.sort(dynamicSort("start_date"));
     visitsSorted.reverse();
     //uniqueVisitedPlaces.sort(dynamicSort("name"))
 }

 //00.03 Array of Visited Countries, Regions and Cities
 function createArraysOfVisitedCountriesAndCities(){
    countriesRegionsCitiesVisited = [];
    for (var i = 0; i < uniqueVisitedPlaces.length; i++){
        countriesRegionsCitiesVisited.push(new getCityObject(uniqueVisitedPlaces[i]))
    }
 }

 //00.04 City Object definition
 function getCityObject(city_id) {
     for (var i = 0; i < data.city.length; i++) {
         if (data.city[i].city_id == city_id) {
             this.city_id = data.city[i].city_id;
             this.capital = (data.city[i].capital === "true") ? true : false;
             this.description = data.city[i].description;
             this.image = data.city[i].image;
             this.lat = data.city[i].lat;
             this.long = data.city[i].long;
             this.name = data.city[i].name;
             this.name_nt = data.city[i].name_nt;
             this.name_ru = data.city[i].name_ru;
             this.setFullCityName = function () {
                 return this.name_ru + " - " + this.name_nt + " - " + this.name;
             }
             this.region = (new getRegionObject(data.city[i].region_id));
             break;
         }
     }
 }

//00.05 Region Object definition
 function getRegionObject(region_id) {
     for (var i = 0; i < data.area.length; i++) {
         if (data.area[i].region_id == region_id) {
             this.region_id = data.area[i].region_id;
             this.active = (data.area[i].active === "Y") ? true : false;
             this.name = data.area[i].name;
             this.name_ru = data.area[i].name_ru;
             this.setFullRegionName = function () {
                 return this.name_ru + " - " + this.name;
             }
             this.country = (new getCountryObject(data.area[i].country_id));
             break;
         }
     }
 }

//00.06 Country Object definition
 function getCountryObject(country_id) {
     for (var i = 0; i < data.country.length; i++) {
         if (data.country[i].country_id == country_id) {
             this.country_id = data.country[i].country_id;
             this.short_name = data.country[i].short_name;
             this.name = data.country[i].name;
             this.name_nt = data.country[i].name_nt;
             this.name_ru = data.country[i].name_ru;
             this.setFullCountryName = function () {
                 return this.name_ru + " - " + this.name_nt + " - " + this.name;
             }
             this.continent_id = data.country[i].continent_id;
             this.getContinentName = function () {
                 for (var i = 0; i < data.continent.length; i++){
                     if (data.continent[i].continent_id == this.continent_id) {
                     return this.name_ru;
                     }
                 }
             }
             break;
         }
     }
 }

  //00.07 Visit Object definition
  function getVisitObject(start_date, end_date, city, photos, story) {
      this.cities = getCitiesList(city);
      this.photos = photos;
      this.story = story;

      var startVisit = start_date.split(".");
      this.start_date = new Date(startVisit[2],startVisit[1] - 1,startVisit[0]);

      var endVisit = end_date.split(".");
      this.end_date = new Date(endVisit[2], endVisit[1] - 1, endVisit[0]);

      function getCitiesList (citiesList){
         cities = [];
         for (var i = 0; i < citiesList.length; i++){
         var item = {};
             item.id = citiesList[i];
             item.name = getFullLocationName(citiesList[i]);
             cities.push(item);
         }
         return cities;
      };
  }

 //Questions for Oleg:
 //1. Is it necessary to add real name to visits&
 //2. Is it really necessary to add real name to unique city name array?
 //3. Clarify objects inheritage so how better to get country from city. Maybe better to add getCountry to city object as well?