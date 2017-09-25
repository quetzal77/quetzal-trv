//11. Settings Page - City

//11.01 Creation of main City add, edit, removal section
function createSettingsCityTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"city");
    local[1] = "city";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("cities").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ){
        listOfCountries += '<li><a id="' + country.short_name + '" onclick="javascript:showAllTheCitiesOfSelectedCountry(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Cities</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"city\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"city\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<p><b>Pencil</b> is shown for all the non mandatory fields.</p>' +
                    '<p>For <b>image</b> there is a possibility to add more than one picture, you can add as many images as possible just split them with comma like "one.jpg,two.jpg".</p>' +
                    '<hr>' +
                    '<p><b>Select country</b> that city you gonna to add/edit/remove belongs to. It has to reduce list of cities shown and makes it more userfriendly.</p>' +
                    '<div id="countryDropdown" class="btn-toolbar">' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info btn-default">List of existing Countries</button>' +
                            '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                listOfCountries +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="CityListSection"></div>' +
            '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//11.02 Second city drop down
function showAllTheCitiesOfSelectedCountry(id) {
    var listOfCities = '';
    local[2] = id;
    $.each (data.city.sort(dynamicSort("name_ru")), function( i, city ){
        var cityObj = new CityObj(city.city_id);
        var cityName = (city.type) ? getCityNameUpdatedRu(city.name_ru, city.type) : city.name_ru;
        if (cityObj.getCountryId() == id){
            listOfCities += '<li><a id="' + city.city_id + '" onclick="javascript:addEditRemoveCity(this.id)" onmouseover="" style="cursor: pointer;">' + cityName + '</a></li>';
        }
    });

    document.getElementById("CityListSection").innerHTML =
            '<div id="cityDropdown" class="btn-toolbar" style = "margin-left: 15px;">' +
                '<p><b>Select city</b> that you want to add/edit/remove.</p>' +
                '<div class="btn-group">' +
                    '<button type="button" class="btn btn-info btn-default btn-second-list">List of existing Cities</button>' +
                    '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                    '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a id="addnew" onclick="javascript:addEditRemoveCity(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                        '<li role="separator" class="divider"></li>' +
                        listOfCities +
                    '</ul>' +
                '</div>' +
            '</div>';
    document.getElementById("AddEditRemoveSection").innerHTML = "";
}

//11.03 Creation of section to be able to add new, edit or removal of city
function addEditRemoveCity(itemId) {
    var removeButton = ""; var contValue = ""; var readonly = ""; var editIdField = ""; var types = ""; var regions = "";
    var header = "Add new"; var submitStatus = "add";
    var city = (itemId != "addnew") ? $.grep (data.city, function( n, i ) {return ( n.city_id == itemId )}) : "newcity";
    local[0] = {
        city_id: itemId,
        name_ru: (itemId != "addnew") ? city[0].name_ru : "",
        name: (itemId != "addnew") ? city[0].name : "",
        name_nt: (itemId != "addnew") ? (city[0].name_nt != undefined) ? city[0].name_nt: "" : "",
        region_id: (itemId != "addnew") ? city[0].region_id : ""
    };

    if (itemId != "addnew" && city[0].capital != undefined) { local[0].capital = city[0].capital; }
    var capital = (local[0].capital == "true") ? "checked" : "";
    if (itemId != "addnew" && city[0].type != undefined) { local[0].type = city[0].type; }
    if (itemId != "addnew" && city[0].image != undefined) { local[0].image = city[0].image; }
    var image = (local[0].image != undefined) ? local[0].image : "";
    if (itemId != "addnew" && city[0].lat != undefined) { local[0].lat = city[0].lat; }
    var lat = (local[0].lat != undefined) ? local[0].lat : "";
    if (itemId != "addnew" && city[0].lat_2 != undefined) { local[0].lat_2 = city[0].lat_2; }
    var lat_2 = (local[0].lat_2 != undefined) ? local[0].lat_2 : "";
    if (itemId != "addnew" && city[0].long != undefined) { local[0].long = city[0].long; }
    var long = (local[0].long != undefined) ? local[0].long : "";
    if (itemId != "addnew" && city[0].long_2 != undefined) { local[0].long_2 = city[0].long_2; }
    var long_2 = (local[0].long_2 != undefined) ? local[0].long_2 : "";
    if (itemId != "addnew" && city[0].description != undefined) { local[0].description = city[0].description; }
    var description = (local[0].description != undefined) ? local[0].description : "";

    $.each (data.area.sort(dynamicSort("name_ru")), function( i, region ) {
        if ( region.country_id == getCountryId(local[2]) ) {
            var selected = (region.region_id == city[0].region_id) ? " selected" : "";
            regions += "<option value='" + region.region_id + "' " + selected + ">" + region.name_ru + "</option>";
        }
    });

    $.each (data.type.sort(dynamicSort("name_ru")), function( i, type ) {
        var selected = (type.type_id == city[0].type) ? " selected" : "";
        types += "<option value='" + type.type_id + "' " + selected + ">" + type.name_ru + "</option>";
    });

    if (itemId != "addnew"){
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveCity();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' city</h2>' +
        '<form>' +
            removeButton +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique city Id" ' + contValue + readonly + '>' +
                editIdField +
            '</div>' +
            '<span id="alert_id"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + local[0].name_ru + '" placeholder="Enter russian name of city">' +
            '</div>' +
            '<span id="alert_name_ru"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + local[0].name + '" placeholder="Enter english name of city">' +
            '</div>' +
            '<span id="alert_name"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newNtName" type="text" class="form-control" value="' + local[0].name_nt + '" placeholder="Enter native name of city (use language of main nation)">' +
            '</div>' +
            '<span id="alert_name_nt"></span>' +
            '<br>' +
            '<div class="input-group">' +
            '<label class="checkbox-inline"><input type="checkbox"  id="newCapital" value="" ' + capital + '>Capital identifier</label>' +
            '</div>' +
            '<span id="alert_capital"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<select id="newRegion" class="form-control">' +
                    '<option value="0">Select region that city belongs to.</option>' +
                    regions +
                '</select>' +
            '</div>' +
            '<span id="alert_region"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newImage" type="text" class="form-control" value="' + image + '" placeholder="Enter either image name of few of them">' +
                '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newImageCheck" onclick="javascript:checkImage()">Check image</button></span>' +
            '</div>' +
            '<span id="alert_image"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<select id="newType" class="form-control">' +
                    '<option value="0">Default type. Select type that your city belongs to or leave it as is in case its default one.</option>' +
                    types +
                '</select>' +
            '</div>' +
            '<span id="alert_type"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLat" type="text" class="form-control" value="' + lat + '" placeholder="Enter latitude of your city">' +
            '</div>' +
            '<span id="alert_lat"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLong" type="text" class="form-control" value="' + long + '" placeholder="Enter longitude of your city">' +
            '</div>' +
            '<span id="alert_long"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<button type="button" class="btn btn-default active" onclick="openGoogleMap();return false">Check Google Map</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<button type="button" class="btn btn-default active" onclick="openCountryMap();return false">Check Country Map</button>' +
            '</div>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLat_2" type="text" class="form-control" value="' + lat_2 + '" placeholder="Enter second latitude of your city">' +
            '</div>' +
            '<span id="alert_lat_2"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLong_2" type="text" class="form-control" value="' + long_2 + '" placeholder="Enter second longitude of your city">' +
            '</div>' +
            '<span id="alert_long_2"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<button type="button" class="btn btn-default active" onclick="openSecondGoogleMap();return false">Check Google Map</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '</div>' +
            '<br>' +
            '<div class="form-group">' +
                '<textarea id="newDescription" class="form-control" rows="5" placeholder="Enter description of city with listing of sights.">' + description + '</textarea>' +
            '</div>' +
            '<span id="alert_description"></span>' +
        '<span id="checkFlags"></span>' +
        '<hr>' +
        '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
        '</form>';
}

//11.04 Remove item entity handler
function RemoveCity() {
    var newID = document.getElementById('newId').value;
    var distinctIds = {};
    var visitToRemoveArray = [];
    $.each (visitsSorted, function( i, visit ) {
        $.each (visit.cities, function( i, city ) {
            if (city.city_id == newID && !distinctIds[visit.start_date]){
                visitToRemoveArray.push(visit);
                distinctIds[visit.start_date] = true;
            }
        });
    });

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ru");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_region");
    removeAllChildNodes("success");

    if (visitToRemoveArray.length > 0) {
        var visitesLinkedToCity = "";
        $.each (visitToRemoveArray, function( i, visit ){
            visitesLinkedToCity += '<b>' + getVisitDate(visit.start_date, visit.end_date, true) + '</b>, ';
        });
        document.getElementById("remove").innerHTML =
            '<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<strong>Error!</strong> This item can\'t be removed, because it\'s still dependent on some visit. Change city id (or remove visit) for following visites: ' +
            visitesLinkedToCity.slice(0, -2) + '.' +
            '</div>';
    }
    else {
        $.getScript("SCRIPTS/set_content.js", function(){
            removeElementOfGlobalData4DefinedArray ("city_id", newID);
            createSettingsCityTab_HTML();
            alertOfSuccess();
        });
    }
}

//11.05 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var newCityObj = {
                     name: document.getElementById("newRusName").value.trim(),
                     name_nt: document.getElementById("newNtName").value.trim(),
                     name_ru: document.getElementById("newEngName").value.trim(),
                     city_id: document.getElementById("newId").value.trim()
                   };

    if (document.getElementById("newRegion").value != "0") { newCityObj["region_id"] = document.getElementById("newRegion").value; }
    if (document.getElementById("newType").value != "0") { newCityObj["type"] = document.getElementById("newType").value; }
    if (document.getElementById('newCapital').checked) { newCityObj["capital"] = "true"; }
    if (document.getElementById("newLat").value.trim() != "") { newCityObj["lat"] = document.getElementById("newLat").value.trim(); }
    if (document.getElementById("newLat_2").value.trim() != "") { newCityObj["lat_2"] = document.getElementById("newLat_2").value.trim(); }
    if (document.getElementById("newLong").value.trim() != "") { newCityObj["long"] = document.getElementById("newLong").value.trim(); }
    if (document.getElementById("newLong_2").value.trim() != "") { newCityObj["long_2"] = document.getElementById("newLong_2").value.trim(); }
    if (document.getElementById("newImage").value.trim() != "") { newCityObj["image"] = document.getElementById("newImage").value.trim(); }
    if (document.getElementById("newDescription").value.trim() != "") { newCityObj["description"] = document.getElementById("newDescription").value.trim(); }

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ru");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_region");
    removeAllChildNodes("success");

    if (status == "add") {
        if (checkRules4AddUpdate(newCityObj)) {
            $.getScript("SCRIPTS/set_content.js", function(){
                addElementOfGlobalDataArray(newCityObj);
                createSettingsCityTab_HTML();
                alertOfSuccess();
            });
        }
    }
    else {
        if (checkRules4AddUpdate(newCityObj)) {
            $.getScript("SCRIPTS/set_content.js", function(){
                updateElementOfGlobalDataArray(newCityObj);
                createSettingsCityTab_HTML();
                alertOfSuccess();
            });
        }
    }
    return false;
}

//11.06 Verification for Add/Update fields
function checkRules4AddUpdate(cityObj) {
    var result = true;
    var initialCityObj = local[0];
    for (var i = 0; i < data.city.length; i++) {
        if (initialCityObj.city_id != "addnew") {
            if (initialCityObj.city_id.toLowerCase() != cityObj.city_id.toLowerCase() && data.city[i].city_id.toLowerCase() == cityObj.city_id.toLowerCase()){
                alertOfDuplicateFailure(data.city[i].city_id, data.city[i].name_ru);
                result = false;
            }
        }
        else {
            if (data.city[i].city_id.toLowerCase() == cityObj.city_id.toLowerCase()){
                alertOfDuplicateFailure(data.city[i].city_id, data.city[i].name_ru);
                result = false;
            }
        }
        if (cityObj.city_id == ''){ alertOfEmptyMandatoryField("alert_id"); result = false; }
        if (cityObj.name_ru == ''){ alertOfEmptyMandatoryField("alert_name_ru"); result = false; }
        if (cityObj.name == ''){ alertOfEmptyMandatoryField("alert_name"); result = false; }
        if (cityObj.region_id == undefined){ alertOfEmptyMandatoryField("alert_region"); result = false; }
    }
    return result;
}


//11.07 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Cities to see changes added.' +
        '</div>';
}

//11.08 Failure flag for not unique ID applied
function alertOfDuplicateFailure(id, name_ru) {
    removeAllChildNodes("success");
    document.getElementById("alert_id").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id  + ' (' + name_ru + ')</b>. Try to use another id!' +
        '</div>';
}

//11.09 Failure flag for empty mandatory field
function alertOfEmptyMandatoryField(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Mandatory field is empty. Popullate it before submit.' +
        '</div>';
}

//11.10 Open Google map for lat and long coordinates
function openGoogleMap() {
    removeAllChildNodes("alert_lat");
    removeAllChildNodes("alert_long");
    var lat = document.getElementById("newLat").value.trim();
    var long = document.getElementById("newLong").value.trim();

    if (lat != "" && long != "") {
        window.open("https://www.google.com/maps/@" + lat + "," + long + ",12z",'_blank');
    }
    else {
        (lat == "") ? alertOfEmptyMandatoryField("alert_lat") : alertOfEmptyMandatoryField("alert_long");
    }
}

//11.11 Open Country map for lat and long coordinates
function openSecondGoogleMap() {
    removeAllChildNodes("alert_lat_2");
    removeAllChildNodes("alert_long_2");
    var lat_2 = document.getElementById("newLat_2").value.trim();
    var long_2 = document.getElementById("newLong_2").value.trim();

    if (lat_2 != "" && long_2 != "") {
        window.open("https://www.google.com/maps/@" + lat_2 + "," + long_2 + ",12z",'_blank');
    }
    else {
        (lat_2 == "") ? alertOfEmptyMandatoryField("alert_lat_2") : alertOfEmptyMandatoryField("alert_long_2");
    }
}

//11.11 Open Country map for lat and long coordinates
function openCountryMap() {
    var lat = document.getElementById("newLat").value.trim();
    var long = document.getElementById("newLong").value.trim();

    var page = window.open("",'_blank');
    page.document.write(
        "<html>" +
            "<head>" +
                "<title>Country Map</title>" +
                "<script src='SCRIPTS/MAPS/ammap.js' type='text/javascript'></script>" +
                "<script src='SCRIPTS/MAPS/custommap.js' type='text/javascript'></script>" +
                "<script src='SCRIPTS/MAPS/" + local[2] + "Low.js' type='text/javascript'></script>" +
            "</head>" +
            "<body>" +
                "<div id='mapdiv' class='map'>&nbsp;</div>" +
                "<script>document.getElementById('mapdiv').innerHTML = CreateMap();</script>" +
            "</body>" +
        "</html>");
}

//11.12 Add image to verify if it looks good
function checkImage() {
    var images = document.getElementById("newImage").value.trim();
    var html = "";
    $.each (images.split(","), function( i, image ){
        html += '<img src="IMG/' + image + '" class="city_photo img-thumbnail">';
    });

    if (images != "") {
        document.getElementById("checkFlags").innerHTML = '<hr>' + html;
    }
    else {
        alertOfEmptyMandatoryField("alert_image");
    }

}