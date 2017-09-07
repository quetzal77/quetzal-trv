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
    // Update Country Array with new ID
    if (initialEntityObj.continent_id.toUpperCase() != newEntityObj.continent_id.toUpperCase()) {
        $.each (data.country, function( i, country ){
            if (country.continent_id == initialEntityObj.continent_id){
                country.continent_id = newEntityObj.continent_id;
            }
        });
    }
    // Update Continent array with new data

}