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
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"city\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"city\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
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
    var removeButton = "";
    var contValue = "";
    var readonly = "";
    var header = "Add new";
    var submitStatus = "add";
    var name = "";
    var name_ru = "";
    var editIdField = "";
    local[0] = itemId;

    if (itemId != "addnew"){
        var city = $.grep (data.city, function( n, i ) {return (n.city_id == itemId)});
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        name_ru = city[0].name_ru;
        name = city[0].name;
        local[0] = {
            city_id: itemId,
            name_ru: city[0].name_ru,
            name: city[0].name
        };
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
            '<span id="alert1"></span>' +
            '<br>' +
//            '<div class="input-group">' +
//                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
//                '<input id="newEngName" type="text" class="form-control" value="' + name_ru + '" placeholder="Enter russian name of continent">' +
//            '</div>' +
//            '<span id="alert2"></span>' +
//            '<br>' +
//            '<div class="input-group">' +
//                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
//                '<input id="newRusName" type="text" class="form-control" value="' + name + '" placeholder="Enter english name of continent">' +
//            '</div>' +
//            '<span id="alert3"></span>' +
//        '<hr>' +
//        '<input type="submit" class="btn btn-default" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
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

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
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