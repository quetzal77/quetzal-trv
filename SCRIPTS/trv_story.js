//07.01 Creator of page
function createStoryPage_HTML(storyId) {
//    var city = $.grep (citiesVisited, function( n, i ) {
//        return (n.city_id == cityId)
//    });
//
    // Set global variable with type of map to be opened
//    local = [];
//    local.push(storyId, "story");

    // Set url
    window.history.pushState("object or string", "Title", "index.html?storyId="+storyId);

    //Add Country main content
//    document.getElementById("mainSection").innerHTML = "<div class='countrylabel'>" + local[1].setFullCityName() + "</div>" +
//                                                         HTML_CityDetais(cityId)
}