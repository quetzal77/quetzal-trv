//00.00 On Load fucntions
//This page is first one loaded, and depend on its logic we dynamically build appropriate pages

//00.01 ARRAY USED FOR CREATION OF WORLD PAGE
    var initial_data;  // Store initial information for creation of home page
    var local; // Store variable that describe which country have to be opened and drawn on a map
    var url = "http://localhost:63342/quetzal-trv/index.html";

//00.02 Run function on load of World page (Home page)
//This is jQuery function that takes data from json and transform them to collection that could be basis for creation of world page
    window.onload = function() {$.getJSON( "DATA/onload.json", processMyJson)};
// When the user scrolls down from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

//00.03 This method creates initial collection we need to populate world page
//Also it contains logic of loading
    var processMyJson = function (result){
        initial_data = result;
        //Add all the services used among all the classes
        $.getScript("SCRIPTS/bcd_services.js", function(){ getWorldPage(headerMenu); });
    }

    var headerMenu = function populateHeaderMenu(){
        //Creation of Country Selector
        document.getElementById("ContentBody_CountryList").innerHTML = getSelectorOfListOfCountries_HTML();
        //Creation of City Selector
        document.getElementById("ContentBody_CityList").innerHTML = getSelectorOfListOfCities_HTML();
        //Creation of Story Selector
        document.getElementById("ContentBody_StoryList").innerHTML = getSelectorOfListOfStories_HTML();
    }

    function getWorldPage( callback ){
        //Create world page
        $.getScript("SCRIPTS/trv_world.js", function(){
            createWorldPage_HTML();
            //Create arrays with all the traveler's data
            $.getScript("SCRIPTS/bcd-content.js", function(){ populateContent(callback); });
        });
    }

    function getCountryPage( country_id ){
        //Create country page
        $.getScript("SCRIPTS/trv_country.js", function(){ createCountryPage_HTML(country_id) });
    }

    function getCityPage( city_id ){
        //Create country page
        $.getScript("SCRIPTS/trv_city.js", function(){ createCityPage_HTML(city_id) });
    }

    function getStoryPage( story_id ){
        //Create story page
        $.getScript("SCRIPTS/trv_story.js", function(){ createStoryPage_HTML(story_id) });
    }

    function getSettingsOverviewPage( setting_type ){
        //Create settings-overview page
        $.getScript("SCRIPTS/set_overview.js", function(){ createSettingsPage_HTML(setting_type) });
    }

    function createSettingsContinentTab(){
        //Create settings-continent tab
        $.getScript("SCRIPTS/set_continent.js", function(){ createSettingsContinentTab_HTML() });
    }

    function createSettingsTypeTab(){
        //Create settings-location_type tab
        $.getScript("SCRIPTS/set_type.js", function(){ createSettingsTypeTab_HTML() });
    }

    function createSettingsCityTab(){
        //Create settings-city tab
        $.getScript("SCRIPTS/set_city.js", function(){ createSettingsCityTab_HTML() });
    }

    function createSettingsCountryTab(){
        //Create settings-country tab
        $.getScript("SCRIPTS/set_country.js", function(){ createSettingsCountryTab_HTML() });
    }

    function createSettingsRegionTab(){
        //Create settings-region tab
        $.getScript("SCRIPTS/set_region.js", function(){ createSettingsRegionTab_HTML() });
    }

    function createSettingsVisitTab(){
        //Create settings-visit tab
        $.getScript("SCRIPTS/set_visit.js", function(){ createSettingsVisitTab_HTML() });
    }

    function createSettingsStoryTab(){
        //Create settings-story tab
        $.getScript("SCRIPTS/set_story.js", function(){ createSettingsStoryTab_HTML() });
    }

    function createSettingsExportTab(){
        //Create settings-export tab
        $.getScript("SCRIPTS/set_export.js", function(){ createSettingsExportTab_HTML() });
    }

