//00.01 Run function on load of World page
//This is jQuery object that take data from xml and transform them to some collections
window.onload = function() {
    $.getJSON( "DATA/areas.json", processMyJson);
};

var processMyJson = function(result){
jsonDoc = result;
}