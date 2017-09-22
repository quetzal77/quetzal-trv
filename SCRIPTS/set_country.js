//12. Settings Page - Country

//12.01 Creation of main Country add, edit, removal section
function createSettingsCountryTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"country");
    local[1] = "country";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("countries").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ){
        listOfCountries += '<li><a id="' + country.short_name + '" onclick="javascript:addEditRemoveCountry(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
                '<h1 class="page-header">Countries</h1>' +
                '<span id="success"></span>' +
                    '<div class="well">' +
                        '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"country\" entity.</p>' +
                        '<p>Select \"Add new\" option to add new \"country\" or choose some particular entity that gonna be either edited or removed.</p>' +
                        '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                        '<p><b>Pencil</b> is shown for all the non mandatory fields.</p>' +
                        '<div id="countryDropdown" class="btn-toolbar">' +
                            '<div class="btn-group">' +
                                '<button type="button" class="btn btn-info btn-default">List of existing Countries</button>' +
                                '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                                '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                    '<li><a id="addnew" onclick="javascript:addEditRemoveCountry(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                                    '<li role="separator" class="divider"></li>' +
                                    listOfCountries +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//12.02 Creation of section to be able to add new, edit or removal of country
function addEditRemoveCountry(itemId) {
    var removeButton = ""; var contIdValue = ""; var contSNValue = ""; var readonly = ""; var editIdField = ""; var editIdField_2 = "";
    var header = "Add new"; var submitStatus = "add"; var continents = '';
    var country = (itemId != "addnew") ? $.grep (data.country, function( n, i ) {return ( n.short_name == itemId )}) : "newcountry";
    local[0] = {
        country_id: (itemId != "addnew") ? country[0].country_id : "",
        continent_id: (itemId != "addnew") ? country[0].continent_id : "",
        name: (itemId != "addnew") ? country[0].name : "",
        name_ru: (itemId != "addnew") ? country[0].name_ru : "",
        name_nt: (itemId != "addnew") ? (country[0].name_nt != undefined) ? country[0].name_nt: "" : "",
        short_name: itemId
    };

    $.each (data.continent.sort(dynamicSort("name_ru")), function( i, continent ) {
        var selected = (continent.continent_id == country[0].continent_id) ? " selected" : "";
        continents += "<option value='" + continent.continent_id + "' " + selected + ">" + continent.name_ru + "</option>";
    });

    if (itemId != "addnew"){
        contIdValue = 'value="' + local[0].country_id + '" ';
        contSNValue = 'value="' + local[0].short_name + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveCountry();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
        editIdField_2 = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newShortName" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' country</h2>' +
        '<form>' +
            removeButton +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique city Id" ' + contIdValue + readonly + '>' +
                editIdField +
            '</div>' +
            '<span id="alert_id"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newShortName" type="text" class="form-control" placeholder="Enter unique city Short Name" ' + contSNValue + readonly + '>' +
                editIdField_2 +
            '</div>' +
            '<span id="alert_short_name"></span>' +
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
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<select id="newRegion" class="form-control">' +
                    '<option value="0">Select continent that country belongs to.</option>' +
                    continents +
                '</select>' +
            '</div>' +
            '<span id="alert_region"></span>' +
            '<br>' +
        '<hr>' +
        '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
        '</form>';
}