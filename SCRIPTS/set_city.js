//11. Settings Page - Location Types

//11.01 Creation of main Continents add, edit, removal section
function createSettingsCityTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"city");

    local[1] = "city";

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
                    '<p><b>TIPS:</b></p>' +
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
}

//11.02 Second city drop down
function showAllTheCitiesOfSelectedCountry(id) {
    var listOfCities = '';
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

//11.03 Creation of section to be able to add new, edit or removal of continent
function addEditRemoveCity(itemId) {
    var removeButton = ""; var contValue = ""; var readonly = ""; var editIdField = ""; var types = "";
    var header = "Add new"; var submitStatus = "add";
    var city = (itemId != "addnew") ? $.grep (data.city, function( n, i ) {return ( n.city_id == itemId )}) : "newcity";
    local[0] = {
        city_id: itemId,
        name_ru: (itemId != "addnew") ? city[0].name_ru : "",
        name: (itemId != "addnew") ? city[0].name : "",
        name_nt: (itemId != "addnew") ? (city[0].name_nt != undefined) ? city[0].name_nt: "" : "",
        image: (itemId != "addnew") ? (city[0].image != undefined) ? city[0].image: "" : "",
        capital: (city[0].capital == "true") ? "checked" : "",
        type: (itemId != "addnew") ? (city[0].type != undefined) ? city[0].type: "" : "",
        region_id: (itemId != "addnew") ? city[0].region_id : "",
        lat: (itemId != "addnew") ? (city[0].lat != undefined) ? city[0].lat: "" : "",
        lat_2: (itemId != "addnew") ? (city[0].lat_2 != undefined) ? city[0].lat_2: "" : "",
        long: (itemId != "addnew") ? (city[0].long != undefined) ? city[0].long: "" : "",
        long_2: (itemId != "addnew") ? (city[0].long_2 != undefined) ? city[0].long_2: "" : "",
        description: (itemId != "addnew") ? (city[0].description != undefined) ? city[0].description: "" : ""
    };
    //        var regions = $.grep (data.area, function( n, i ) {return ( n.country_id == city[0]. )});
    $.each (data.type.sort(dynamicSort("name_ru")), function( i, type ) {
        var selected = (type.type_id == city[0].type) ? " selected" : "";
        types += "<option" + selected + ">" + type.name_ru + "</option>";
    });

    if (itemId != "addnew"){
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-default" onclick="RemoveCity();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' continent</h2>' +
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
            '<label class="checkbox-inline"><input type="checkbox" value="" ' + local[0].capital + '>Capital identifier</label>' +
            '</div>' +
            '<span id="alert_capital"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newImage" type="text" class="form-control" value="' + local[0].image + '" placeholder="Enter either image name of few of them">' +
            '</div>' +
            '<span id="alert_image"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<select id="newType" class="form-control">' +
                    '<option>Default type. Select type that your city belongs to or leave it as is in case its default one.</option>' +
                    types +
                '</select>' +
            '</div>' +
            '<span id="alert_type"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLat" type="text" class="form-control" value="' + local[0].lat + '" placeholder="Enter latitude of your city">' +
            '</div>' +
            '<span id="alert_lat"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLat_2" type="text" class="form-control" value="' + local[0].lat_2 + '" placeholder="Enter second latitude of your city">' +
            '</div>' +
            '<span id="alert_lat_2"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLong" type="text" class="form-control" value="' + local[0].long + '" placeholder="Enter longitude of your city">' +
            '</div>' +
            '<span id="alert_long"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newLong_2" type="text" class="form-control" value="' + local[0].long_2 + '" placeholder="Enter second longitude of your city">' +
            '</div>' +
            '<span id="alert_long_2"></span>' +
            '<br>' +
            '<div class="form-group">' +
                '<textarea id="newDescription" class="form-control" rows="5" placeholder="Enter description of city with listing of sights.">' + local[0].description + '</textarea>' +
            '</div>' +
            '<span id="alert_description"></span>' +
        '<hr>' +
        '<input type="submit" class="btn btn-default" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
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

//11.06 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Cities to see changes added.' +
        '</div>';
}