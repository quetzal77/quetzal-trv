//00.00 On Load fucntions
//This page is first one loaded, and depend on its logic we dynamically build appropriate pages

//00.01 ARRAY USED FOR CREATION OF WORLD PAGE
 var initial_data;

//00.02 Run function on load of World page (Home page)
//This is jQuery function that takes data from json and transform them to collection that could be basis for creation of world page
window.onload = function() {
    $.getJSON( "DATA/onload.json", processMyJson)
    };

//00.03 This method creates initial collection we need to populate world page
//Also it contains logic of loading
 var processMyJson = function(result){
    initial_data = result;

    //Create page content depend on type of selected location (world, country or city)
    var url = "http://localhost:63342/quetzal-trv/index.html";
    var location = window.location.href.substring(url.length, window.location.href.length);

    if (location != ""){
        var detailsOfRequest = location.split("=");
        switch (detailsOfRequest[0]) {
            case "country":
                day = "Sunday";
                break;
            case "city":
                day = "Monday";
                break;
            case "story":
                day = "Tuesday";
                break;
        }
    }
    else {
        $.getScript("SCRIPTS/bcd_services.js");
        $.getScript("SCRIPTS/trv_world.js", function(){ createWorldPage_HTML(initial_data.continent, initial_data.country, drawMap) });
    }
 }

 var drawMap = function(){
     $.getScript("SCRIPTS/MAPS/ammap.js");
     $.getScript("SCRIPTS/MAPS/custommap.js");
     $.getScript("SCRIPTS/MAPS/worldLow.js", function(){
         CreateMap("none")
         $('#mapdiv').css('background', '');
     });

     $.getScript("SCRIPTS/trv_bcfunc.js");
 }


