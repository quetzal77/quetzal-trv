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
            // ...
            break;
        case 'area':
            // ...
            break;
        case 'city':
            data.city.push(entityObj);
            data.city.sort(dynamicSort("name_ru"));
            data.city.sort(dynamicSort("region_id"));
            break;
        case 'visit':
            // ...
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
     //            removeElementOfGlobalDataArray (data.country, attr, value);
     //            //TBD - check and refresh initial_data array
                 break;
             case 'area':
     //            removeElementOfGlobalDataArray (data.area, attr, value);
     //            //TBD - check and refresh initial_data array
                 break;
             case 'city':
                 updateElementOfCityArray (initialEntityObj, newEntityObj);
                 data.city.sort(dynamicSort("name_ru"));
                 data.city.sort(dynamicSort("region_id"));
                 refreshAllTheArrays ();
                 break;
             case 'visit':
     //            removeElementOfGlobalDataArray (data.visit, attr, value);
//                        data.continent.sort(dynamicSort("name_ru"));
//                      initial_data.continent.sort(dynamicSort("name_ru"));
     //            //TBD - check and refresh initial_data array
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
//            removeElementOfGlobalDataArray (data.country, attr, value);
//            //TBD - check and refresh initial_data array
            break;
        case 'area':
//            removeElementOfGlobalDataArray (data.area, attr, value);
//            //TBD - check and refresh initial_data array
            break;
        case 'city':
            removeElementOfGlobalDataArray (data.city, attr, value);
            break;
        case 'visit':
//            removeElementOfGlobalDataArray (data.visit, attr, value);
//            //TBD - check and refresh initial_data array
            break;
    }
}

//10.04 Update Continent and Country array with new data
function updateElementOfContinentArray(initialEntityObj, newEntityObj) {
    continent_id = (initialEntityObj.continent_id.toUpperCase() != newEntityObj.continent_id.toUpperCase()) ? true : false;
    name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    name = (initialEntityObj.name != newEntityObj.name) ? true : false;

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
    type_id = (initialEntityObj.type_id.toUpperCase() != newEntityObj.type_id.toUpperCase()) ? true : false;
    name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    name = (initialEntityObj.name != newEntityObj.name) ? true : false;

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
debugger;
    city_id = (initialEntityObj.city_id.toLowerCase() != newEntityObj.city_id.toLowerCase()) ? true : false;
    name = (initialEntityObj.name != newEntityObj.name) ? true : false;
    name_nt = (initialEntityObj.name_nt != newEntityObj.name_nt) ? true : false;
    name_ru = (initialEntityObj.name_ru != newEntityObj.name_ru) ? true : false;
    region_id = (initialEntityObj.region_id != newEntityObj.region_id) ? true : false;
    type = (initialEntityObj.type != newEntityObj.type) ? true : false;
//    capital =
    lat = (initialEntityObj.lat != newEntityObj.lat) ? true : false;
    lat_2 = (initialEntityObj.lat_2 != newEntityObj.lat_2) ? true : false;
    long = (initialEntityObj.long != newEntityObj.long) ? true : false;
    long_2 = (initialEntityObj.long_2 != newEntityObj.long_2) ? true : false;
    image = (initialEntityObj.image != newEntityObj.image) ? true : false;
    description = (initialEntityObj.description != newEntityObj.description) ? true : false;

    // Update Global Visit Array with new ID
    if (city_id) {
        $.each (data.visit, function( i, visit ){
            $.each (visit.city, function( i, city ){
                if (city == initialEntityObj.city_id){
                    city = newEntityObj.city_id;
                }
            });
        });
    }
    // Update Global City array with new data
    $.each (data.city, function( i, city ){
        if (city.city_id == initialEntityObj.city_id) {
            if (city_id){ city.city_id = newEntityObj.city_id; }
            if (name_ru){ city.name_ru = newEntityObj.name_ru; }
            if (name){ city.name = newEntityObj.name; }
            if (name_nt){ city.name_nt = newEntityObj.name_nt; }
            if (region_id){ city.region_id = newEntityObj.region_id; }
            if (type){ city.type = newEntityObj.type; }
            if (image){ city.image = newEntityObj.image; }
            if (description){ city.description = newEntityObj.description; }
            if (lat){ city.lat = newEntityObj.lat; }
            if (lat_2){ city.lat_2 = newEntityObj.lat_2; }
            if (long){ city.long = newEntityObj.long; }
            if (long_2){ city.long_2 = newEntityObj.long_2; }
        }
    });
}