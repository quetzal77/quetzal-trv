//10. Settings Page - Location Types

//10.01 Creation of main Continents add, edit, removal section
function createSettingsTypeTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"type");

    local[1] = "type";

    removeAllAttributesByName("class", "active");
    document.getElementById("types").setAttribute("class", "active")

    var listOfLOcationTypes = '';
    $.each (data.type.sort(dynamicSort("name_ru")), function( i, type ){
        listOfLOcationTypes += '<li><a id="' + type.type_id + '" onclick="javascript:addEditRemoveLocationTypes(this.id)" onmouseover="" style="cursor: pointer;">' + type.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Location Types</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"type\" of location.</p>' +
                    '<p>Select \"Add new\" option to add new \"type\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<div class="btn-toolbar">' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info btn-default">List of existing Location Types</button>' +
                            '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                '<li><a id="addnew" onclick="javascript:addEditRemoveLocationTypes(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                                '<li role="separator" class="divider"></li>' +
                                listOfLOcationTypes +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="AddEditRemoveSection"></div>';
}

//10.02 Creation of section to be able to add new, edit or removal of continent
function addEditRemoveLocationTypes(itemId) {
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
        var type = $.grep (data.type, function( n, i ) {return (n.type_id == itemId)});
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        name_ru = type[0].name_ru;
        name = type[0].name;
        local[0] = {
            type_id: itemId,
            name_ru: type[0].name_ru,
            name: type[0].name
        };
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveLocationType();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' location type</h2>' +
        '<form>' +
            removeButton +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique type Id" ' + contValue + readonly + '>' +
                editIdField +
            '</div>' +
            '<span id="alert1"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + name_ru + '" placeholder="Enter russian name of type">' +
            '</div>' +
            '<span id="alert2"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + name + '" placeholder="Enter english name of type">' +
            '</div>' +
            '<span id="alert3"></span>' +
        '<hr>' +
        '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
        '</form>';

}

//10.03 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var typeObj = {
                     type_id: document.getElementById("newId").value.trim(),
                     name_ru: document.getElementById("newEngName").value.trim(),
                     name: document.getElementById("newRusName").value.trim()
                   };

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (status == "add") {
        if (checkRules4AddUpdate(typeObj)) {
            $.getScript("SCRIPTS/set_content.js", function(){
                addElementOfGlobalDataArray(typeObj);
                createSettingsTypeTab_HTML();
                alertOfSuccess();
            });
        }
    }
    else {
        if (checkRules4AddUpdate(typeObj)) {
            $.getScript("SCRIPTS/set_content.js", function(){
                updateElementOfGlobalDataArray(typeObj);
                createSettingsTypeTab_HTML();
                alertOfSuccess();
            });
        }
    }
    return false;
}

//10.04 Remove item event handler
function RemoveLocationType() {
    var newID = document.getElementById('newId').value;
    var cityToRemoveArray = $.grep (data.city, function( n, i ) {return (n.type == newID)});

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (cityToRemoveArray.length > 0) {
        var citiesLinkedToType = "";
        $.each (cityToRemoveArray, function( i, city ){
            citiesLinkedToType += '<b>' + city.name_ru + '</b>, ';
        });
        document.getElementById("remove").innerHTML =
            '<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<strong>Error!</strong> This item can\'t be removed, because it\'s still dependent on some city. Change type id (or remove city) for following cities: ' +
            citiesLinkedToType.slice(0, -2) + '.' +
            '</div>';
    }
    else {
        $.getScript("SCRIPTS/set_content.js", function(){
            removeElementOfGlobalData4DefinedArray ("type_id", newID);
            createSettingsTypeTab_HTML();
            alertOfSuccess();
        });
    }
}

//10.05 Verification for Add/Update fields
function checkRules4AddUpdate(typeObj) {
    var result = true;
    var initialTypeObj = local[0];
    for (var i = 0; i < data.type.length; i++) {
        if (initialTypeObj != "addnew") {
            if (initialTypeObj.type_id != typeObj.type_id && data.type[i].type_id == typeObj.type_id){
                alertOfDuplicateFailure(data.type[i].type_id, data.type[i].name_ru);
                result = false;
            }
        }
        else {
            if (data.type[i].type_id == typeObj.type_id.toUpperCase()){
                alertOfDuplicateFailure(data.type[i].type_id, data.type[i].name_ru);
                result = false;
            }
        }
        if (typeObj.type_id == ''){ alertOfEmptyMandatoryField("alert1"); result = false; }
        if (typeObj.name_ru == ''){ alertOfEmptyMandatoryField("alert2"); result = false; }
        if (typeObj.name == ''){ alertOfEmptyMandatoryField("alert3"); result = false; }
    }
    return result;
}

//10.05 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Location Types to see changes added.' +
        '</div>';
}

//10.06 Failure flag for not unique ID applied
function alertOfDuplicateFailure(id, name_ru) {
    removeAllChildNodes("success");
    document.getElementById("alert1").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id + ' (' + name_ru + ')</b>. Try to use another id!' +
        '</div>';
}

//10.07 Failure flag for empty mandatory field
function alertOfEmptyMandatoryField(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Mandatory field is empty. Popullate it before submit.' +
        '</div>';
}
