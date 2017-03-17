//12. Settings Page - Continents

//12.01 Creation of main Continents add, edit, removal section
function HTML_Settings_ContinentsTab() {
    removeAllAttributesByName("class", "active");
    document.getElementById("continents").setAttribute("class", "active")

    var listOfContinents = '';
    for (var x = 0; x < continents.length; x++) {
        if (continents[x].id != undefined) {
            listOfContinents += '<li><a id="' + continents[x].id + '" onclick="javascript:addEditRemoveContinents(this.id)" onmouseover="" style="cursor: pointer;">' + continents[x].nameen + '</a></li>';
        }
    }

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Continents</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"continent\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"continent\" to list or select some particular entity that gonna be edited or removed.</p>' +
                    '<p>Pay your attention that Id is key field, so change of id is considered as adding of new entity.</p>' +
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

//12.02 Creation of section to be able to add new, edit or removal of continent
function addEditRemoveContinents(itemId) {
    var removeButton =  "";
    var contEn = "";
    var contRu = "";
    var contValue = "";
    var submitStatus = "add";
    var readonly = "";

    if (itemId != "addnew"){
        contValue = 'value="' + itemId + '"';
        submitStatus = "edit"
        readonly = "readonly";
        removeButton =  '<button type="submit" class="btn btn-default" id="' + itemId + '" onclick="javascript:RemoveContinent(this.id)">Remove selected item</button>' +
                        '<span id="remove"></span>' +
                        '<hr>';

        for (var x = 0; x < continents.length; x++) {
            if (continents[x].id != undefined) {
                if (continents[x].id == itemId){
                    contEn = continents[x].nameen;
                    contRu = continents[x].nameru;
                    break;
                }
            }
        }
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">Add new continent</h2>' +
        removeButton +
        '<form>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique continent Id" ' + contValue + readonly + ' >' +
            '</div>' +
            '<span id="alert"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + contEn + '" placeholder="Enter english name of continent" >' +
            '</div>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + contRu + '" placeholder="Enter russian name of continent" >' +
            '</div>' +
        '<hr>' +
        '<button id="' + submitStatus + '" type="submit" class="btn btn-default" onclick="javascript:SubmitChanges(this.id)">Submit changes</button>' +
        '</form>';

}

//12.03 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var newID = document.getElementById('newId').value;
    var newEngName = document.getElementById('newEngName').value;
    var newRusName = document.getElementById('newRusName').value;

    removeAllChildNodes("alert");
    removeAllChildNodes("success");

    if (status == "add") {
        var z = 0;
        for (var x = 0; x < continents.length; x++) {
            if (continents[x].id != undefined) {
                if (continents[x].id == newID) {
                    document.getElementById("alert").innerHTML =
                        '<div class="alert alert-danger fade in">' +
                        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
                        '<strong>Error!</strong> Continent Id is not unique, it\'s already accociated with <b>' + continents[x].nameen + '</b>. Try to find another option!' +
                        '</div>';
                    z = 1;
                    break;
                }
            }
        }
        if (z == 0) {
            //Here must be method for add new item to DB
            //After changes are applied to DB, array must be refreshed so changes could be shown
            alertOfSuccess()
        }
    }
    else {
        //Here must be method for DB update
        //After changes are applied to DB, array must be refreshed so changes could be shown
        alertOfSuccess()
    }

}

//12.04 Remove item event handler
function RemoveContinent(continentId) {
    var z = 0;
    var newID = document.getElementById('newId').value;
    var newEngName = document.getElementById('newEngName').value;
    var newRusName = document.getElementById('newRusName').value;
    var contToRemoveArray = [];

    removeAllChildNodes("alert");
    removeAllChildNodes("success");

    for (var x = 0; x < countries.length; x++) {
        if (countries[x].cont != undefined) {
            if (countries[x].cont == continentId){
                contToRemoveArray.push(countries[x].ident);
            }
        }
    }

    if (contToRemoveArray.length > 0) {
        var countriesLinkedToCont = "";
        for (var i = 0; i < contToRemoveArray.length; i++) {
            countriesLinkedToCont += '<b>' + HTML_ShortCountryName(contToRemoveArray[i]) + '</b>, ';
        }
        z = 1;
        document.getElementById("remove").innerHTML =
            '<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<strong>Error!</strong> This item can\'t be removed, because it\'s still dependent on some country. Change continent id (or remove country) for following countries: ' +
            countriesLinkedToCont.slice(0, -2) + '.' +
            '</div>';
    }
    if (z == 0) {
        //Here must be method for DB item removal
        //After changes are applied to DB, array must be refreshed so changes could be shown
        alertOfSuccess()
    }
}

//12.05 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of continents to see changes added.' +
        '</div>';
}
