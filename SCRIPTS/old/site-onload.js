//00. Run function on load of World page
//This is jQuery object that take data from xml and transform them to some collections
window.onload = function() {
    $.get( "DATA/globaldb.xml", processMyXML, 'xml');
};

//00.01 ARRAYS USED FOR CREATION OF WORLD PAGE
var xmlDoc;
var sizes, continents, countries, visites, areas, cities, ArrayOfVisitedCountriesIDs, ArrayOfVisitedCountries, ArrayOfVisitsSorted;

//00.02 This method creates all collections we need to populate list of countries
var processMyXML = function(data) {
    xmlDoc = data;
    //List of objects represents levels of locations
    //sizes = processCollection($(data).find('level'));
    //List of continents with their attributes
    continents = processCollection($(data).find('continent'));
    //List of all world countries with their attributes
    countries = processCollection($(data).find('country'));
    //List of my visits with ID of visited country
    visites = processCollection($(data).find('visit'));
    //List of all worlds areas with ID of country they belongs to
    areas = processCollection($(data).find('area'));
    //List of all worlds cities with ID of area they belongs to
    cities = processCollection($(data).find('city'));
    //List of unique IDs of visited countries
    ArrayOfVisitedCountriesIDs = CollectVisitedCountries();
    //List of unique Countries
    ArrayOfVisitedCountries = VisitedCountriesList();
    //Array of visits sorted descendently and with dates in DATETIME format
    ArrayOfVisitsSorted = SortedListOfVisites();

    //Create page content depend on type of selected location (world, country or city)
	HTML_CreatorOfWorldPage()
}