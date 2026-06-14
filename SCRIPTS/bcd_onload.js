//00.00 On Load fucntions
//This page is first one loaded, and depend on its logic we dynamically build appropriate pages

//00.01 ARRAY USED FOR CREATION OF WORLD PAGE
    var initial_data;  // Store initial information for creation of home page
    var local; // Store variable that describe which country have to be opened and drawn on a map
    var skipPushState = true; // when true, the next page creator re-renders WITHOUT pushing history (initial load + Back/Forward)

//00.02 Run function on load of World page (Home page)
//This is jQuery function that takes data from json and transform them to collection that could be basis for creation of world page
    window.onload = function() {$.getJSON( "DATA/onload.json", processMyJson)};
// When the user scrolls down from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};
// Browser Back/Forward: re-render the page for the current URL without pushing a new entry
    window.onpopstate = function() {
        var params = new URLSearchParams(window.location.search);
        skipPushState = true;
        if (params.get("country"))      { getCountryPage(params.get("country")); }
        else if (params.get("cityId"))  { getCityPage(params.get("cityId")); }
        else if (params.get("storyId")) { getStoryPage(params.get("storyId")); }
        else if (params.get("page") === "about")    { HTML_CreatorOfAboutPage(); }
        else if (params.get("page") === "statistics") { getStatisticsPage(); }
        else if (params.get("page") === "settings") { getSettingsOverviewPage(); }
        else                            { createWorldPage_HTML(); getNumberOfLocation(); }
    };
// Close the navbar search dropdown when clicking outside of it
    document.addEventListener("click", function(e){
        var search = document.getElementById("navSearch");
        var box = document.getElementById("navSearchResults");
        if (box && search && e.target !== search && !box.contains(e.target)) {
            box.classList.remove("show");
        }
    });

//00.03 This method creates initial collection we need to populate world page
//Also it contains logic of loading
    var processMyJson = function (result){
        initial_data = result;
        //Add all the services used among all the classes
        $.getScript("SCRIPTS/bcd_services.js", function(){ getWorldPage(headerMenu); });
    }

    var headerMenu = function populateHeaderMenu(){
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

    function getStatisticsPage(){
        //Create statistics page
        $.getScript("SCRIPTS/trv_statistics.js", function(){ createStatisticsPage_HTML() });
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

