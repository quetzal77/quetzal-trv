//10. Settings Page - Continents

//10.01 Add data in Global Data Array
function addElementOfGlobalDataArray(entityObj) {
    switch(local[1]) {
        case 'type':
            data.type.push(entityObj);
            data.type.sort(dynamicSort("name_ru"));
            break;
        case 'continent':
            data.continent.push(entityObj);
            data.continent.sort(dynamicSort("name_ru"));
            break;
        case 'country':
            data.country.push(entityObj);
            data.country.sort(dynamicSort("name_ru"));
            break;
        case 'region':
            data.area.push(entityObj);
            data.area.sort(dynamicSort("name_ru"));
            break;
        case 'city':
            data.city.push(entityObj);
            data.city.sort(dynamicSort("name_ru"));
            break;
        case 'visit':
            data.visit.push(entityObj);
//            data.visit.sort(dynamicSort("start_date"));
            refreshAllTheArrays ();
            break;
    }
 }

//10.02 Update data in Global Data Array
function updateElementOfGlobalDataArray(newEntityObj) {
     var initialEntityObj = local[0];

         switch(local[1]) {
             case 'type':
                 updateElementOfTypeArray(initialEntityObj, newEntityObj)
                 data.type.sort(dynamicSort("name_ru"));
                 refreshAllTheArrays ();
                 break;
             case 'continent':
                 updateElementOfContinentArray (initialEntityObj, newEntityObj);
                 data.continent.sort(dynamicSort("name_ru"));
                 refreshAllTheArrays ();
                 break;
             case 'country':
                 updateElementOfCountryArray (initialEntityObj, newEntityObj);
                 data.country.sort(dynamicSort("name_ru"));
                 refreshAllTheArrays ();
                 break;
             case 'region':
                 updateElementOfRegionArray (initialEntityObj, newEntityObj);
                 data.area.sort(dynamicSort("name_ru"));
                 refreshAllTheArrays ();
                 break;
             case 'city':
                 updateElementOfCityArray (initialEntityObj, newEntityObj);
                 data.city.sort(dynamicSort("name_ru"));
                 refreshAllTheArrays ();
                 break;
             case 'visit':
                 updateElementOfVisitArray (initialEntityObj, newEntityObj);
//                 data.city.sort(dynamicSort("start_date")); //TBD
                 refreshAllTheArrays ();
                 break;
         }
 }

//10.03 Remove data from Global Data Arrays
function removeElementOfGlobalData4DefinedArray(attr, value) {
    switch(local[1]) {
        case 'type':
            removeElementOfGlobalDataArray (data.type, attr, value);
            break;
        case 'continent':
            removeElementOfGlobalDataArray (data.continent, attr, value);
            break;
        case 'country':
            removeElementOfGlobalDataArray (data.country, attr, value);
            break;
        case 'region':
            removeElementOfGlobalDataArray (data.area, attr, value);
            break;
        case 'city':
            removeElementOfGlobalDataArray (data.city, attr, value);
            break;
        case 'visit':
            removeElementOfGlobalDataArray (data.visit, attr, value);
            break;
    }
}

//10.04 Update Continent and Country array with new data
function updateElementOfContinentArray(initialEntityObj, newEntityObj) {
    var continent_id = (initialEntityObj.continent_id.toUpperCase() != newEntityObj.continent_id.toUpperCase()) ? true : false;
    var name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    var name = (initialEntityObj.name != newEntityObj.name) ? true : false;

    // Update Global Country Array with new ID
    if (continent_id) {
        $.each (data.country, function( i, country ){
            if (country.continent_id == initialEntityObj.continent_id){
                country.continent_id = newEntityObj.continent_id;
            }
        });
    }
    // Update Global Continent array with new data
    $.each (data.continent, function( i, continent ){
        if (continent.continent_id == initialEntityObj.continent_id) {
            if (continent_id){ continent.continent_id = newEntityObj.continent_id; }
            if (name_ru){ continent.name_ru = newEntityObj.name_ru; }
            if (name){ continent.name = newEntityObj.name; }
        }
    });
    // Update Onload Country Array with new ID
    if (continent_id) {
        $.each (initial_data.country, function( i, country ){
            if (country.continent_id == initialEntityObj.continent_id){
                country.continent_id = newEntityObj.continent_id;
            }
        });
    }
    // Update Onload Continent array with new data
    $.each (initial_data.continent, function( i, continent ){
        if (continent.continent_id == initialEntityObj.continent_id) {
            if (continent_id){ continent.continent_id = newEntityObj.continent_id; }
            if (name_ru){ continent.name_ru = newEntityObj.name_ru; }
        }
    });
}

//10.05 Update Type and City arrays with new data
function updateElementOfTypeArray(initialEntityObj, newEntityObj) {
    var type_id = (initialEntityObj.type_id.toUpperCase() != newEntityObj.type_id.toUpperCase()) ? true : false;
    var name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    var name = (initialEntityObj.name != newEntityObj.name) ? true : false;

    // Update Global City Array with new ID
    if (type_id) {
        $.each (data.city, function( i, city ){
            if (city.type == initialEntityObj.type_id){
                city.type = newEntityObj.type_id;
            }
        });
    }
    // Update Global Type array with new data
    $.each (data.type, function( i, type ){
        if (type.type_id == initialEntityObj.type_id) {
            if (type_id){ type.type_id = newEntityObj.type_id; }
            if (name_ru){ type.name_ru = newEntityObj.name_ru; }
            if (name){ type.name = newEntityObj.name; }
        }
    });
}

//10.05 Update City and Visit arrays with new data
function updateElementOfCityArray(initialEntityObj, newEntityObj) {
    var city_id = (initialEntityObj.city_id.toLowerCase() != newEntityObj.city_id.toLowerCase()) ? true : false;
    var name = (initialEntityObj.name != newEntityObj.name) ? true : false;
    var name_nt = (initialEntityObj.name_nt != newEntityObj.name_nt) ? true : false;
    var name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    var region_id = (initialEntityObj.region_id != newEntityObj.region_id) ? true : false;
    var type = (initialEntityObj.type != newEntityObj.type) ? true : false;
    var capital = (initialEntityObj.capital != newEntityObj.capital) ? true : false;
    var lat = (initialEntityObj.lat != newEntityObj.lat) ? true : false;
    var lat_2 = (initialEntityObj.lat_2 != newEntityObj.lat_2) ? true : false;
    var long = (initialEntityObj.long != newEntityObj.long) ? true : false;
    var long_2 = (initialEntityObj.long_2 != newEntityObj.long_2) ? true : false;
    var image = (initialEntityObj.image != newEntityObj.image) ? true : false;
    var description = (initialEntityObj.description != newEntityObj.description) ? true : false;

    if (city_id) {
        for (var i = 0; i < data.visit.length; i ++) {
            for (var j = 0 ; j < data.visit[i].city.length; j ++) {
                if (data.visit[i].city[j] == initialEntityObj.city_id) {
                    data.visit[i].city[j] = newEntityObj.city_id;
                }
            }
        }
    }

    // Update Global City array with new data
    $.each (data.city, function( i, city ){
        if (city.city_id == initialEntityObj.city_id) {
            if (city_id){ city.city_id = newEntityObj.city_id; }
            if (name_ru){ city.name_ru = newEntityObj.name_ru; }
            if (name){ city.name = newEntityObj.name; }
            if (name_nt){ city.name_nt = newEntityObj.name_nt; }
            if (region_id){ city.region_id = newEntityObj.region_id; }
            if (type){ if (newEntityObj.type != undefined) {city.type = newEntityObj.type;} else {delete city['type'];} }
            if (image){ if (newEntityObj.image != undefined) {city.image = newEntityObj.image;} else {delete city['image'];} }
            if (description){ if (newEntityObj.description != undefined) {city.description = newEntityObj.description;} else {delete city['description'];} }
            if (lat){ if (newEntityObj.lat != undefined) {city.lat = newEntityObj.lat;} else {delete city['lat'];} }
            if (lat_2){ if (newEntityObj.lat_2 != undefined) {city.lat_2 = newEntityObj.lat_2;} else {delete city['lat_2'];} }
            if (long){ if (newEntityObj.long != undefined) {city.long = newEntityObj.long;} else {delete city['long'];} }
            if (long_2){ if (newEntityObj.long_2 != undefined) {city.long_2 = newEntityObj.long_2;} else {delete city['long_2'];} }
            if (capital){ if (newEntityObj.capital != undefined) {city.capital = newEntityObj.capital;} else {delete city['capital'];} }
        }
    });
}

//10.06 Update Country and Region array with new data
function updateElementOfCountryArray(initialEntityObj, newEntityObj) {
    var country_id = (initialEntityObj.country_id.toLowerCase() != newEntityObj.country_id.toLowerCase()) ? true : false;
    var short_name = (initialEntityObj.short_name.toLowerCase() != newEntityObj.short_name.toLowerCase()) ? true : false;
    var continent_id = (initialEntityObj.continent_id.toUpperCase() != newEntityObj.continent_id.toUpperCase()) ? true : false;
    var name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    var name = (initialEntityObj.name != newEntityObj.name) ? true : false;
    var name_nt = (initialEntityObj.name_nt != newEntityObj.name_nt) ? true : false;
    var city_state = (initialEntityObj.city_state != newEntityObj.city_state) ? true : false;
    var small_flag_img = (initialEntityObj.small_flag_img != newEntityObj.small_flag_img) ? true : false;
    var flag_img = (initialEntityObj.flag_img != newEntityObj.flag_img) ? true : false;
    var emb_img = (initialEntityObj.emb_img != newEntityObj.emb_img) ? true : false;
    var map_img = (initialEntityObj.map_img != newEntityObj.map_img) ? true : false;
    var name_nt_text = (name_nt) ? " - " + newEntityObj.name_nt + " - " : " - ";
    var full_name = (name || name_ru || name_nt) ? newEntityObj.name_ru + name_nt_text + newEntityObj.name : false;

    // Update Global Region Array with new ID
    if (country_id) {
        $.each (data.area, function( i, region ){
            if (region.country_id == initialEntityObj.country_id){
                region.country_id = newEntityObj.country_id;
            }
        });
    }
    // Update Global Country array with new data
    $.each (data.country, function( i, country ){
        if (country.country_id == initialEntityObj.country_id) {
            if (country_id){ country.country_id = newEntityObj.country_id; }
            if (continent_id){ country.continent_id = newEntityObj.continent_id; }
            if (name_ru){ country.name_ru = newEntityObj.name_ru; }
            if (name){ country.name = newEntityObj.name; }
            if (name_nt){ country.name_nt = newEntityObj.name_nt; }
            if (short_name){ country.short_name = newEntityObj.short_name; }
            if (small_flag_img){ country.small_flag_img = newEntityObj.small_flag_img; }
            if (flag_img){ country.flag_img = newEntityObj.flag_img; }
            if (emb_img){ country.emb_img = newEntityObj.emb_img; }
            if (map_img){ country.map_img = newEntityObj.map_img; }
            if (city_state){ if (newEntityObj.city_state != undefined) {country.city_state = newEntityObj.city_state;} else {delete country['city_state'];} }
        }
    });
    // Update Onload Country array with new data
    $.each (initial_data.country, function( i, country ){
        if (country.country_id == initialEntityObj.country_id) {
            if (country_id){ country.country_id = newEntityObj.country_id; }
            if (continent_id){ country.continent_id = newEntityObj.continent_id; }
            if (short_name){ country.short_name = newEntityObj.short_name; }
            if (small_flag_img){ country.small_flag_img = newEntityObj.small_flag_img; }
            if (full_name){ country.name_full = full_name; }
        }
    });

    // Update Onload Continent array with new data - We need it for situation when changing continent for some country
    if (continent_id){
        var initial_continent = $.grep (initial_data.continent, function( n, i ) {return (n.continent_id == newEntityObj.continent_id)});
        var continent = $.grep (data.continent, function( n, i ) {return (n.continent_id == newEntityObj.continent_id)});
        if (initial_continent[0] == undefined){
            var entityObj = {
                continent_id: continent[0].continent_id,
                name_ru: continent[0].name_ru
            }
            initial_data.continent.push(entityObj);
            initial_data.continent.sort(dynamicSort("name_ru"));
        }

        //Remove Continent when country moved from it to another one and it doesnt have countries
        debugger;
        createArrayOfVisitedCountriesAndRegions();
        var countrisForInitialContinent = $.grep (countriesVisited, function( n, i ) {return (n.continent_id == initialEntityObj.continent_id.toUpperCase())});
        if (countrisForInitialContinent.length == 0) {removeElementOfGlobalDataArray (initial_data.continent, "continent_id", initialEntityObj.continent_id.toUpperCase());}
    }
}

//10.07 Update Region and City array with new data
function updateElementOfRegionArray(initialEntityObj, newEntityObj) {
    var country_id = (initialEntityObj.country_id.toLowerCase() != newEntityObj.country_id.toLowerCase()) ? true : false;
    var region_id = (initialEntityObj.region_id.toLowerCase() != newEntityObj.region_id.toLowerCase()) ? true : false;
    var name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    var name = (initialEntityObj.name != newEntityObj.name) ? true : false;
    var active = (initialEntityObj.active != newEntityObj.active) ? true : false;

    // Update Global City Array with new ID
    if (region_id) {
        $.each (data.city, function( i, city ){
            if (city.region_id == initialEntityObj.region_id){
                city.region_id = newEntityObj.region_id;
            }
        });
    }
    // Update Global Region array with new data
    $.each (data.area, function( i, region ){
        if (region.region_id == initialEntityObj.region_id) {
            if (country_id){ region.country_id = newEntityObj.country_id; }
            if (region_id){ region.region_id = newEntityObj.region_id; }
            if (name_ru){ region.name_ru = newEntityObj.name_ru; }
            if (name){ region.name = newEntityObj.name; }
            if (active){ region.active = newEntityObj.active; }
        }
    });
}

//10.08 Update Visit array with new data
function updateElementOfVisitArray(initialEntityObj, newEntityObj) {
    var start_date = (initialEntityObj.start_date != newEntityObj.start_date) ? true : false;
    var end_date = (initialEntityObj.end_date != newEntityObj.end_date) ? true : false;
    var city = (initialEntityObj.city != newEntityObj.city) ? true : false; //it's always true, but it's not a problem till this attr is mandatory
    var photos = (initialEntityObj.photos != newEntityObj.photos) ? true : false;
    var story = (initialEntityObj.story != newEntityObj.story) ? true : false;

    // Update Global Visit array with new data
    $.each (data.visit, function( i, visit ){
        if (visit.start_date == initialEntityObj.start_date) {
            if (start_date){ visit.start_date = newEntityObj.start_date; }
            if (end_date){ visit.end_date = newEntityObj.end_date; }
            if (city){ visit.city = newEntityObj.city; }
            if (photos){ visit.photos = newEntityObj.photos; }
            if (story){ visit.story = newEntityObj.story; }
        }
    });

    // Add New Onload Country array with new data

    // Update Onload Country array with new data

    // Update Onload Country array with new data
}