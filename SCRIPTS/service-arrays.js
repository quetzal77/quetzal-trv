//01 This is methods used for creation of all arrays

//01.01 This method transform HTMLCollection to collection (node)
var processCollection = function(collection) {
    var result = [];
    for (var i in collection) {
        result.push(ObjToHash(collection[i]));
    }
    return result;
}

//01.02 This method pars xml tag to type that can be saved as collection
var ObjToHash = function(obj) {
    var hash = {}
    for (var i in obj.attributes) {
        if (undefined != obj.attributes[i].name) {
            hash[obj.attributes[i].name] = parseFloat(obj.attributes[i].value) || obj.attributes[i].value ;
            for(var j in obj.childNodes) {
                if ( obj.childNodes[j].nodeType == 1 ) {
                    hash[obj.childNodes[j].tagName] = obj.childNodes[j].firstChild && obj.childNodes[j].firstChild.data || '';
                }
            }
        }
    }
    return hash;
}

//02. OBJECTs CREATOR
//02.01 List of unique IDs of visited countries
function CollectVisitedCountries() {
    result = [];
    var distinctIds = {};
    for (var i = 0; i < visites.length; i++) {
        if (visites[i].id && !distinctIds[visites[i].id]) {
            result.push(visites[i].id)
            distinctIds[visites[i].id] = true;
        }
    }
    return result;
}

//02.02 Object that contain list if visited countries with their attributes like continent etc so we will be able create html code to display them
function VisitedCountriesList() {
    result = [];
    for (var i = 0; i < ArrayOfVisitedCountriesIDs.length; i++) {
        country = {};
        for (var j = 0; j < countries.length; j++) {
            if (ArrayOfVisitedCountriesIDs[i] == countries[j].id) {
                country.contId = countries[j].cont;
                country.countryName = countries[j].ident;
                country.nameRu = countries[j].nameru;
                country.nameEn = countries[j].nameen;
                country.nameNt = countries[j].nament;
                country.id = countries[j].id;

                var visitPlaces = [];
                for (var j = 0; j < visites.length; j++){
                    if (visites[j].id == ArrayOfVisitedCountriesIDs[i] && visites[j].place){
                        visitPlaces.push.apply (visitPlaces, visites[j].place.split(" "));
                    }
                }
                var uniqueVisitedPlaces = [];
                for (var s = 0; s < visitPlaces.length; s++) {
                    if (uniqueVisitedPlaces.indexOf(visitPlaces[s]) == -1) {
                        uniqueVisitedPlaces.push(visitPlaces[s]);
                    }
                }
                country.visitedCitiesList = uniqueVisitedPlaces;

                var visitedRegion = [];
                for (var f = 0; f < uniqueVisitedPlaces.length; f++){
                    for (var g = 0; g < cities.length; g++){
                        if (uniqueVisitedPlaces[f] == cities[g].id){
                            visitedRegion.push (cities[g].mc_name);
                        }
                    }
                }
                var uniqueVisitedRegions = [];
                for (var h = 0; h < visitPlaces.length; h++) {
                    if (uniqueVisitedRegions.indexOf(visitedRegion[h]) == -1) {
                        if (visitedRegion[h] != undefined) {
                            uniqueVisitedRegions.push(visitedRegion[h]);
                        }
                    }
                }
                country.visitedRegionsList = uniqueVisitedRegions;

                result.push(country);
                break;
            }
        }

    }
    result.sort(dynamicSort("nameRu"));
    return result;
}

//02.03 Array of visits sorted descendently and with dates in DATETIME format
function SortedListOfVisites() {
    result = [];
    for (var i = 0; i < visites.length; i++) {
        if (visites[i].date != undefined){
            var visit = {};
            visit.id = visites[i].id;
            visit.description = visites[i].description;
            visit.image = visites[i].image;
            visit.photos = visites[i].photos;
            visit.place = visites[i].place;
            visit.story = visites[i].story;
            visit.story2 = visites[i].story2;

            var starVisit = visites[i].date.split(".");
            visit.date = new Date(starVisit[2],starVisit[1]-1,starVisit[0]);

            var endVisit = visites[i].enddate.split(".");
            visit.enddate = new Date(endVisit[2], endVisit[1] - 1, endVisit[0]);
            result.push(visit);
        }
        
    }
    result.sort(dynamicSort("date"));
    result.reverse();
    return result
}
