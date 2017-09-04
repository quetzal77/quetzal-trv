//09. Settings Page - Continents

//09.01 Creation of main Continents add, edit, removal section
function createSettingsContinentTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"continent");

    local[1] = "continent";

    removeAllAttributesByName("class", "active");
    document.getElementById("continents").setAttribute("class", "active")

    var listOfContinents = '';
    $.each (data.continent, function( i, continent ){
        listOfContinents += '<li><a id="' + continent.continent_id + '" onclick="javascript:addEditRemoveContinents(this.id)" onmouseover="" style="cursor: pointer;">' + continent.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Continents</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"continent\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"continent\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<div class="btn-toolbar">' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info btn-default">List of existing Continents</button>' +
                            '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                '<li><a id="addnew" onclick="javascript:addEditRemoveContinents(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                                '<li role="separator" class="divider"></li>' +
                                listOfContinents +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="AddEditRemoveSection"></div>';
}

//09.02 Creation of section to be able to add new, edit or removal of continent
function addEditRemoveContinents(itemId) {
    var removeButton = "";
    var contValue = "";
    var readonly = "";
    var header = "Add new";
    var submitStatus = "add";
    var name = "";
    var name_ru = "";
    var editIdField = "";

    if (itemId != "addnew"){
        var continent = $.grep (data.continent, function( n, i ) {return (n.continent_id == itemId)});
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        name = continent[0].name;
        name_ru = continent[0].name_ru
        removeButton = '<button type="submit" class="btn btn-default" onclick="javascript:RemoveContinent()">Remove selected item</button>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' continent</h2>' +
        removeButton +
        '<form>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique continent Id" ' + contValue + readonly + ' required>' +
                editIdField +
            '</div>' +
            '<span id="alert"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + name + '" placeholder="Enter english name of continent" required>' +
            '</div>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + name_ru + '" placeholder="Enter russian name of continent" required>' +
            '</div>' +
        '<hr>' +
        '<button type="submit" id="' + submitStatus + '" class="btn btn-default" onclick="javascript:SubmitChanges(this.id)">Submit changes</button>' +
        '</form>';

}

//09.03 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var continentObj = {
                         continent_id: document.getElementById("newId").value,
                         name_ru: document.getElementById("newEngName").value,
                         name: document.getElementById("newRusName").value
                       };

    removeAllChildNodes("alert");
    removeAllChildNodes("success");

    if (status == "add") {
        var z = true;
        for (var i = 0; i < data.continent.length; i++) {
            if (data.continent[i].continent_id == continentObj.continent_id.toUpperCase()){
                alertOfDuplicateFailure(data.continent[i].continent_id);
                z = false;
                break;
            }
        }
        if (z) {
            $.getScript("SCRIPTS/set_content.js", function(){ addElementOfGlobalDataArray(continentObj)});
            alertOfSuccess()
        }
    }
    else {
        //Here must be method for DB update.
        //In case of change ID we have to change it for all the countries that hold it.
        //After changes are applied to json (new files generated), then we have ro refresh all the arrays
        alertOfSuccess()
    }
}

//09.04 Remove item event handler
function RemoveContinent() {
    var newID = document.getElementById('newId').value;
    var contToRemoveArray = $.grep (data.country, function( n, i ) {return (n.continent_id == newID)});;

    removeAllChildNodes("alert");
    removeAllChildNodes("success");

    if (contToRemoveArray.length > 0) {
        var countriesLinkedToCont = "";
        $.each (contToRemoveArray, function( i, country ){
            countriesLinkedToCont += '<b>' + country.name_ru + '</b>, ';
        });
        document.getElementById("remove").innerHTML =
            '<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<strong>Error!</strong> This item can\'t be removed, because it\'s still dependent on some country. Change continent id (or remove country) for following countries: ' +
            countriesLinkedToCont.slice(0, -2) + '.' +
            '</div>';
    }
    else {
        $.getScript("SCRIPTS/set_content.js", function(){ removeElementOfGlobalData4DefinedArray ("continent_id", newID) });
        alertOfSuccess();
    }
}

//09.05 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Continents to see changes added.' +
        '</div>';
}

//09.06 Failure flag for not unique ID applied
function alertOfDuplicateFailure(id) {
    removeAllChildNodes("alert");
    document.getElementById("alert").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id + '</b>. Try to use another id!' +
        '</div>';
}
