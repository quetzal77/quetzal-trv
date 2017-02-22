//00.00 Run function on load of World page (Home page)
//This is jQuery function that takes data from json and transform them to collection that could be basis for creation of world page
window.onload = function() {
    $.getJSON( "DATA/onload.json", processMyJson);
 };

//00.01 ARRAYS USED FOR CREATION OF WORLD PAGE
 var initial_data

//00.02 This method creates initial collection we need to populate world page
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
        $('<script src="SCRIPTS/trv_world.js" type="text/javascript"></script>').appendTo("body");
        createWorldPage_HTML(initial_data.continent, initial_data.country);
        $('<script src="SCRIPTS/MAPS/ammap.js" type="text/javascript"></script>').appendTo("body");
        $('<script src="SCRIPTS/MAPS/custommap.js" type="text/javascript"></script>').appendTo("body");
        $('<script src="SCRIPTS/MAPS/worldLow.js" type="text/javascript"></script>').appendTo("body");
        CreateMap("none");
    }
 }