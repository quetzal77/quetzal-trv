//00.00 On Load fucntions
//This page is first one loaded, and depend on its logic we dynamically build appropriate pages

//00.01 ARRAY USED FOR CREATION OF WORLD PAGE
 var initial_data;  // Store initial information for creation of home page
 var local; // Store variable that describe which country have to be opened and drawn on a map
 var url = "http://localhost:63342/quetzal-trv/index.html";

//00.02 Run function on load of World page (Home page)
//This is jQuery function that takes data from json and transform them to collection that could be basis for creation of world page
window.onload = function() {$.getJSON( "DATA/onload.json", processMyJson)};

//00.03 This method creates initial collection we need to populate world page
//Also it contains logic of loading
var processMyJson = function (result){
    initial_data = result;

    //Add all the services used among all the classes
    $.getScript("SCRIPTS/bcd_services.js", function()
    {
        //Create page content depend on type of selected location (world, country or city)
        (initial_data) ? getPage() : getWorldPage();
    });
 }

 function getPage(){
     var location = window.location.href.substring(url.length+1, window.location.href.length);
     var local = location.split("=");

     switch (local[0]) {
         case "country":
             $.getScript("SCRIPTS/trv_country.js", function(){ createCountryPage_HTML(local[1]) });
             break;
         case "city":
 //            $.getScript("SCRIPTS/trv_city.js", function(){ createCityPage_HTML(initial_data.continent, initial_data.country) });
             break;
         case "story":
 //            $.getScript("SCRIPTS/trv_story.js", function(){ createStoryPage_HTML(initial_data.continent, initial_data.country) });
             break;
         default:
             getWorldPage(headerMenu);

     }
 }

  function getWorldPage( callback ){
  //Create world page
      $.getScript("SCRIPTS/trv_world.js", function(){ createWorldPage_HTML() });
  //Create arrays with all the traveler's data
      $.getScript("SCRIPTS/bcd-content.js", function(){ populateContent(callback); });
  }

  function getCountryPage( country_id ){
  //Create country page
      $.getScript("SCRIPTS/trv_country.js", function(){ createCountryPage_HTML(country_id) });
  }

  function getCityPage( country_id ){
  //Create country page
      $.getScript("SCRIPTS/trv_country.js", function(){ createCountryPage_HTML(country_id) });
  }

var headerMenu = function populateHeaderMenu(){
    //Creation of Country Selector
    document.getElementById("ContentBody_CountryList").innerHTML = getSelectorOfListOfCountries_HTML();
    //Creation of City Selector
    document.getElementById("ContentBody_CityList").innerHTML = getSelectorOfListOfCities_HTML();
	//Creation of Story Selector
//    document.getElementById("ContentBody_StoryList").innerHTML = HTML_SelectorListOfStories();
    }

