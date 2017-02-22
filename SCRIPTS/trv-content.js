function() {
    $.getJSON( "DATA/globaldb.json", processMyJson);
 };

//00.01 ARRAYS USED FOR CREATION OF WORLD PAGE
  var visitsSorted, citiesVisited, regionsVisited, countriesVisited;

  var processMyJson = function(result){
     content = result;
     //Array of visits sorted descendently and with dates in DATETIME format
     //Plus array of all unique visited locations
     createArrayOfVisitesAndArrayOfCitiesVisited();
     //Array of Visited Countries, Regions and Cities
     createArrayOfVisitedCountriesAndRegions();
  }

  //00.03 Array of visits sorted descendingly and with dates in DATETIME format
   function createArrayOfVisitesAndArrayOfCitiesVisited() {
       visitsSorted = []; //Array to be used for storing all of them visites happened
       citiesVisited = []; //Array to be used for storing all of the unique places so it would be possible to create array of visited countries
       var distinctIds = {};
       for (var i = 0; i < data.visit.length; i++) {
           if (data.visit[i].start_date != undefined && data.visit[i].end_date != undefined && data.visit[i].city != undefined){
               visitsSorted.push(new VisitObj(data.visit[i].start_date, data.visit[i].end_date, data.visit[i].city, data.visit[i].photos, data.visit[i].story));
               for (var j = 0; j < data.visit[i].city.length; j++) {
                  if (!distinctIds[data.visit[i].city[j]]) {
                      citiesVisited.push(new CityObj(data.visit[i].city[j]));
                      distinctIds[data.visit[i].city[j]] = true;
                  }
               }
           }
       }
       visitsSorted.sort(dynamicSort("start_date"));
       visitsSorted.reverse();
       citiesVisited.sort(dynamicSort("name_ru"))
   }

   //00.04 Array of Visited Countries and Regions
   function createArrayOfVisitedCountriesAndRegions(){
      regionsVisited = [];
      var distinctIds = {};
      for (var i = 0; i < citiesVisited.length; i++){
          if (!distinctIds[citiesVisited[i].region_id]){
              regionsVisited.push(new RegionObj(citiesVisited[i].region_id));
              distinctIds[citiesVisited[i].region_id] = true;
          }
      }
      regionsVisited.sort(dynamicSort("name_ru"));

      countriesVisited = [];
      var distinctIds_2 = {};
      for (var i = 0; i < regionsVisited.length; i++){
          if (!distinctIds_2[regionsVisited[i].country_id]){
              countriesVisited.push(new CountryObj(regionsVisited[i].country_id));
              distinctIds_2[regionsVisited[i].country_id] = true;
          }
      }
      countriesVisited.sort(dynamicSort("name_ru"));
   }

   //00.05 City Object definition
   function CityObj(city_id) {
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
               this.region_id = data.city[i].region_id;

               this.setFullCityName = function () {
                   return this.name_ru + " - " + this.name_nt + " - " + this.name;
               }
               this.getRegion = function () {
                  return new RegionObj(data.city[i].region_id);
               }
           break;
           }
       }
   }

  //00.06 Region Object definition
   function RegionObj(region_id) {
       for (var i = 0; i < data.area.length; i++) {
           if (data.area[i].region_id == region_id) {
               this.region_id = data.area[i].region_id;
               this.active = (data.area[i].active === "Y") ? true : false;
               this.name = data.area[i].name;
               this.name_ru = data.area[i].name_ru;
               this.country_id = data.area[i].country_id;
               this.setFullRegionName = function () {
                   return this.name_ru + " - " + this.name;
               }
               this.getCountry = function () {
                  return new CountryObj(data.area[i].country_id);
               }
               this.getNumberOfVisitedCities = function () {
                   var result = 0;
                   for (var i = 0; i < citiesVisited.length; i++){
                       if (citiesVisited[i].region_id == this.region_id) {
                            result += 1;
                       }
                   }
                   return result;
               }
           break;
           }
       }
   }

  //00.07 Country Object definition
   function CountryObj(country_id) {
       for (var i = 0; i < data.country.length; i++) {
           if (data.country[i].country_id == country_id) {
               this.country_id = data.country[i].country_id;
               this.short_name = data.country[i].short_name;
               this.name = data.country[i].name;
               this.name_nt = data.country[i].name_nt;
               this.name_ru = data.country[i].name_ru;
               this.continent_id = data.country[i].continent_id;
               this.getContinentName = function () {
                   for (var i = 0; i < data.continent.length; i++){
                       if (data.continent[i].country_id == this.continent_id) {
                           return this.name_ru;
                       }
                   }
               }
               this.getNumberOfVisitedCities = function () {
                   var result = 0;
                   for (var i = 0; i < regionsVisited.length; i++){
                       if (regionsVisited[i].country_id == this.country_id) {
                            result += regionsVisited[i].getNumberOfVisitedCities();
                       }
                   }
                   return result;
               }
               this.setFullCountryName = function () {
                   return this.name_ru + " - " + this.name_nt + " - " + this.name;
               }
               break;
           }
       }
   }

    //00.08 Visit Object definition
    function VisitObj(start_date, end_date, city, photos, story) {
        this.cities = city;
        this.photos = photos;
        this.story = story;

        var startVisit = start_date.split(".");
        this.start_date = new Date(startVisit[2],startVisit[1] - 1,startVisit[0]);

        var endVisit = end_date.split(".");
        this.end_date = new Date(endVisit[2], endVisit[1] - 1, endVisit[0]);
    }