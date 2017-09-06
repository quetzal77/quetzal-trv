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
function updateElementOfGlobalDataArray() {
     local[1] = "continent";
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