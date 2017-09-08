//10. Settings Page - Continents

//10.01 Add data in Global Data Array
function addElementOfGlobalDataArray(entityObj) {
    switch(local[1]) {
        case 'level':
            // ...
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
            // ...
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
             case 'level':
     //            removeElementOfGlobalDataArray (data.level, attr, value);
     //            //TBD - check and refresh initial_data array
                 break;
             case 'continent':
                 updateElementOfContinentArray (initialEntityObj, newEntityObj);
                 data.continent.sort(dynamicSort("name_ru"));
                 initial_data.continent.sort(dynamicSort("name_ru"));
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
     //            removeElementOfGlobalDataArray (data.city, attr, value);
     //            //TBD - check and refresh initial_data array
                 break;
             case 'visit':
     //            removeElementOfGlobalDataArray (data.visit, attr, value);
     //            //TBD - check and refresh initial_data array
                 break;
         }
 }

//10.03 Remove data from Global Data Arrays
function removeElementOfGlobalData4DefinedArray(attr, value) {
    switch(local[1]) {
        case 'level':
//            removeElementOfGlobalDataArray (data.level, attr, value);
//            //TBD - check and refresh initial_data array
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
//            removeElementOfGlobalDataArray (data.city, attr, value);
//            //TBD - check and refresh initial_data array
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