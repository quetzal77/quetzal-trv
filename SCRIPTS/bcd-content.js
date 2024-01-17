//01.00 Content
//These functions have to create all the object with content data

//01.01 ARRAYS USED FOR CREATION OF WORLD PAGE
  var visitsSorted, citiesVisited, regionsVisited, countriesVisited;

function populateContent(callback) {
    $.getJSON( "DATA/globaldb.json", function(result){ processMyJson(result); callback();});
 };

  var processMyJson = function(result){
     data = result;
     //Array of visits sorted descendently and with dates in DATETIME format
     //Plus array of all unique visited locations
     createArrayOfVisitesAndArrayOfCitiesVisited();
     //Array of Visited Countries, Regions and Cities
     createArrayOfVisitedCountriesAndRegions();
     //Calculate number of location visited and add them to front page
     if (local[0] == "world"){
        getNumberOfLocation();
     }
  }

  //01.03 Array of visits sorted descendingly and with dates in DATETIME format
   function createArrayOfVisitesAndArrayOfCitiesVisited() {
       visitsSorted = []; //Array to be used for storing all of them visites happened
       citiesVisited = []; //Array to be used for storing all of the unique places so it would be possible to create array of visited countries
       var distinctIds = {};
       for (var i = 0; i < data.visit.length; i++) {
           if (data.visit[i].start_date != undefined && data.visit[i].end_date != undefined && data.visit[i].city != undefined){
               var cities = []; //This variable is used to store arrays of cities with country identifier which will be stored in Visits array

               for (var j = 0; j < data.visit[i].city.length; j++) {
                    var city = {};
                    var cityObj = new CityObj(data.visit[i].city[j]);

                    city [ "city_id" ] = data.visit[i].city[j];
                    city [ "country_id" ] = cityObj.getCountryId();

                    if (city [ "country_id" ] != "") {
                        cities.push(city)
                    }
                    else
                    {
                        alert(data.visit[i].city[j]);
                    }

                    if (!distinctIds[data.visit[i].city[j]]) {
                        citiesVisited.push(cityObj);
                        distinctIds[data.visit[i].city[j]] = true;
                    }
               }

               visitsSorted.push(new VisitObj(data.visit[i].start_date, data.visit[i].end_date, cities, data.visit[i].photos, data.visit[i].story));
           }
       }
       visitsSorted.sort(dynamicSort("start_date"));
       visitsSorted.reverse();
       citiesVisited.sort(dynamicSort("name_ru"))
   }

   //01.04 Array of Visited Countries and Regions
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

   //01.05 City Object definition
   function CityObj(city_id) {
       for (var i = 0; i < data.city.length; i++) {
           if (data.city[i].city_id == city_id) {
               this.type = "city";
               this.city_id = data.city[i].city_id;
               this.capital = (data.city[i].capital === "true") ? true : false;
               this.description = data.city[i].description;
               this.image = data.city[i].image;
               this.lat = data.city[i].lat;
               this.long = data.city[i].long;
               this.city_type = data.city[i].type;

               if (data.city[i].lat_2) {
                   this.lat_2 = data.city[i].lat_2;
                   this.long_2 = data.city[i].long_2;
               }

               this.name = (data.city[i].type) ? getCityNameUpdatedEn(data.city[i].name, data.city[i].type) : data.city[i].name;
               this.name_nt = data.city[i].name_nt;
               this.name_ru = (data.city[i].type) ? getCityNameUpdatedRu(data.city[i].name_ru, data.city[i].type) : data.city[i].name_ru;
               this.region_id = data.city[i].region_id;

               this.setFullCityName = function () {
                  var result;
                  if (this.name_nt == "") {
                       result = this.name_ru + " - " + this.name;
                  }
                  else if (this.name_ru == "") {
                       result = this.name_nt + " - " + this.name;
                  }
                  else if (this.name == "") {
                       result = this.name_ru + " - " + this.name_nt;
                  }
                  else {
                       result = this.name_ru + " - " + this.name_nt + " - " + this.name;
                  }
                  return result;
               }
               this.getCountryId = function () {
                var region;
                for (var j = 0; j < data.area.length; j++) {
                    if (data.area[j].region_id == this.region_id)
                        {region = data.area[j];}
                }
                   if(typeof region == "undefined") { return ""; }
                  var country = $.grep (data.country, function( n, i ){
                      return (n.country_id == region.country_id)
                  });

                  return country[0].short_name;
              }
               this.getRegion = function () {
                  return new RegionObj(this.region_id);
               }
           break;
           }
       }
   }

  //01.06 Region Object definition
   function RegionObj(region_id) {
       for (var i = 0; i < data.area.length; i++) {
           if (data.area[i].region_id == region_id && data.area[i].active != "N") {
               this.type = "region";
               this.region_id = data.area[i].region_id;
               this.active = (data.area[i].active === "Y") ? true : false;
               this.name = data.area[i].name;
               this.name_ru = data.area[i].name_ru;
               this.country_id = data.area[i].country_id;
               this.continent_id = data.area[i].continent_id;
               this.setFullRegionName = function () {
                   return this.name_ru + " - " + this.name;
               }
               this.getCountry = function () {
                  return new CountryObj(this.country_id);
               }

               this.getNumberOfVisitedCities = function (continent_id) {
                   var result = 0;
                   
                   if (this.continent_id !== undefined && continent_id !== undefined && this.continent_id != continent_id)
                   {
                    return result;
                   }

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

  //01.07 Country Object definition
   function CountryObj(country_id) {
       for (var i = 0; i < data.country.length; i++) {
           if (data.country[i].country_id == country_id) {
               this.type = "country";
               this.country_id = data.country[i].country_id;
               this.short_name = data.country[i].short_name;
               this.name = data.country[i].name;
               this.name_nt = data.country[i].name_nt;
               this.name_ru = data.country[i].name_ru;
               this.continent_id = data.country[i].continent_id;
               this.continent_id2 = data.country[i].continent_id2;
               this.city_state = (data.country[i].city_state === "true") ? true : false;
               this.small_flag_img = data.country[i].small_flag_img;
               this.flag_img = data.country[i].flag_img;
               this.emb_img = data.country[i].emb_img;
               this.map_img = data.country[i].map_img;
               this.getContinentName = function () {
                   for (var i = 0; i < data.continent.length; i++){
                       if (data.continent[i].country_id == this.continent_id) {
                           return this.name_ru;
                       }
                   }
               }
               this.getNumberOfVisitedCities = function (continent_id) {
                   var result = 0;
                   for (var i = 0; i < regionsVisited.length; i++){
                       if (regionsVisited[i].country_id == this.country_id) {
                            result += regionsVisited[i].getNumberOfVisitedCities(continent_id);
                       }
                   }
                   return result;
               }
               this.getNumberOfVisitedRegions = function () {
                   var result = 0;
                   for (var i = 0; i < regionsVisited.length; i++){
                       if (regionsVisited[i].country_id == this.country_id) {
                            result = result + 1;
                       }
                   }
                   return result;
               }
               this.getNumberOfVisits = function () {
                  var result = 0;
                  for (var i = 0; i < regionsVisited.length; i++){
                      if (regionsVisited[i].country_id == this.country_id) {
                           result = result + 1;
                      }
                  }
                  return result;
              }
               this.getListOfVisitedRegions = function () {
                   var result = "";
                   for (var i = 0; i < regionsVisited.length; i++){
                       if (regionsVisited[i].country_id == this.country_id) {
                            result += regionsVisited[i].region_id + ",";
                       }
                   }
                   return result;
               }
               this.setFullCountryName = function () {
                   var result;
                   if (this.name_nt == "" || this.name_nt == undefined) {
                        result = this.name_ru + " - " + this.name;
                   }
                   else if (this.name_ru == "" || this.name_ru == undefined) {
                        result = this.name_nt + " - " + this.name;
                   }
                   else if (this.name == "" || this.name == undefined) {
                        result = this.name_ru + " - " + this.name_nt;
                   }
                   else {
                        result = this.name_ru + " - " + this.name_nt + " - " + this.name;
                   }
                   return result;
               }
               break;
           }
       }
   }

    //01.08 Visit Object definition
    function VisitObj(start_date, end_date, city, photos, story) {
        this.cities = city;
        this.photos = photos;
        this.story = story;

        var startVisit = start_date.split(".");
        this.start_date = new Date(startVisit[2], startVisit[1] - 1, startVisit[0]);
        var endVisit = end_date.split(".");
        this.end_date = new Date(endVisit[2], endVisit[1] - 1, endVisit[0]);
    }

    //01.09 Get updated city EN name when it has type defined
    function getCityNameUpdatedEn(name, type_id) {
    var result;
        $.each(data.type, function( i, type ){
            if (type.type_id == type_id){result = (name.toLowerCase().includes(type.name)) ? name : name + " (" + type.name + ").";}
        });
    return result;
    }

    //01.10 Get updated city RU name when it has type defined
    function getCityNameUpdatedRu(name_ru, type_id) {
    var result;
        $.each(data.type, function( i, type ){
            if (type.type_id == type_id){result = (name_ru.toLowerCase().includes(type.name_ru)) ?  name_ru : name_ru + " (" + type.name_ru + ")";}
        });
    return result;
    }