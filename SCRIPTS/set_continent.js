//12. Settings Page - Continents

//12.01 Creation of main Continents add, edit, removal section
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

//12.02 Creation of section to be able to add new, edit or removal of continent
function addEditRemoveContinents(itemId) {
    var removeButton = "";
    var contValue = "";
    var readonly = "";
    var header = "Add new";
    var submitStatus = "add";
    var name = "";
    var name_ru = "";

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
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' continent</h2>' +
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
                '<input id="newEngName" type="text" class="form-control" value="' + name + '" placeholder="Enter english name of continent" >' +
            '</div>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + name_ru + '" placeholder="Enter russian name of continent" >' +
            '</div>' +
        '<hr>' +
        '<button type="submit" id="' + submitStatus + '" class="btn btn-default" onclick="javascript:SubmitChanges(this.id)">Submit changes</button>' +
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
        $.each (data.continent, function( i, continent ){
            if (continents.continent_id == newID){
                alertOfDuplicateFailure(continents.continent_id);
                z = 1;
                break;
            }
        });
        if (z == 0) {
            //Here must be method for add new item to DB
            //After changes are applied to json (new files generated), then we have ro refresh all the arrays
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

//12.04 Remove item event handler
function RemoveContinent() {
    var newID = document.getElementById('newId').value;
    var newEngName = document.getElementById('newEngName').value;
    var newRusName = document.getElementById('newRusName').value;
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
        //TBD - I need to find another solution, to be able to handle issue wo direct switch to Country tab
    }
    else {
        //Here must be method for DB item removal
        //After changes are applied to json (new files generated), then we have ro refresh all the arrays
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

//12.06 Failure flag for not unique ID applied
function alertOfDuplicateFailure(id) {
    removeAllChildNodes("alert");
    document.getElementById("alert").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id + '</b>. Try to use another id!' +
        '</div>';
}
