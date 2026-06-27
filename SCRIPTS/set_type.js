//10. Settings Page - Location Types

//10.01 Creation of main Location Type add, edit, removal section
function createSettingsTypeTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"type");
    local = [];
    local[1] = "type";

    // Set menu marker
    removeAllAttributesByName("class", "active", ".navbar-nav");
    document.getElementById("types").setAttribute("class", "active")

    var nameKey = window.LANG === 'en' ? 'name' : 'name_ua';
    var options = '';
    $.each (data.type.sort(dynamicSort(nameKey)), function( i, type ){
        options += '<option value="' + type.type_id + '">' + (window.LANG === 'en' ? type.name : type.name_ua) + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">🏷️</span>' +
            '<div>' +
                '<h2 class="set-head-title">' + t('setLocationTypes') + '</h2>' +
                '<p class="set-head-desc">' + t('setLTypeDesc') + '</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="typeSelect">' + t('setLTypeSelectLabel') + '</label>' +
            '<select id="typeSelect" class="set-select" onchange="javascript:onTypeSelect(this.value)">' +
                '<option value="">' + t('setSelectOpt') + '</option>' +
                '<option value="addnew">' + t('setLTypeAddNew') + '</option>' +
                options +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//10.02 Selection handler — render the form, or clear it when the placeholder is chosen
function onTypeSelect(value) {
    if (value) { addEditRemoveLocationTypes(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//10.02a Creation of section to be able to add new, edit or remove a location type
function addEditRemoveLocationTypes(itemId) {
    var contValue = "", readonly = "", name = "", name_ua = "";
    var header = t('setLTypeNew');
    var submitStatus = "add";
    var idHint = t('setLTypeIdHint');
    var removeButton = "";
    local[0] = itemId;

    if (itemId != "addnew"){
        var found = $.grep (data.type, function( n, i ) {return (n.type_id == itemId)});
        if (!found[0]) { return; }
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";              // the ID is fixed once a type exists — it can no longer be edited
        idHint = t('setIdFixed');
        header = t('setLTypeEdit');
        submitStatus = "edit";
        name_ua = found[0].name_ua;
        name = found[0].name;
        local[0] = {
            type_id: itemId,
            name_ua: found[0].name_ua,
            name: found[0].name
        };
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:RemoveLocationType()">' + t('setLTypeDelete') + '</button>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            '<div class="set-field">' +
                '<label>' + t('setLTypeIdLabel') + ' <span class="req">*</span></label>' +
                '<input id="newId" type="text" class="set-input" placeholder="' + idHint + '" ' + contValue + readonly + ' oninput="javascript:setTypeFormDirty()">' +
                '<span id="alert1"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setNameUa') + ' <span class="req">*</span></label>' +
                '<input id="newUaName" type="text" class="set-input" value="' + name_ua + '" placeholder="Напр.: Місто" oninput="javascript:setTypeFormDirty()">' +
                '<span id="alert2"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setNameEn') + ' <span class="req">*</span></label>' +
                '<input id="newEngName" type="text" class="set-input" value="' + name + '" placeholder="e.g. City" oninput="javascript:setTypeFormDirty()">' +
                '<span id="alert3"></span>' +
            '</div>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="typeSaveBtn" class="set-btn set-btn-primary" onclick="javascript:SubmitChanges(\'' + submitStatus + '\')" disabled>' + t('setSave') + '</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';
}

//10.02b Enable "Save" only after a field actually changed (vs its initial value)
function setTypeFormDirty() {
    var ids = ["newId", "newUaName", "newEngName"], dirty = false;
    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el && el.value !== el.defaultValue) { dirty = true; break; }
    }
    var btn = document.getElementById("typeSaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//10.03 Submit changes for Add new or edit event
function SubmitChanges(status) {
    var typeObj = {
                     type_id: document.getElementById("newId").value.trim(),
                     name_ua: document.getElementById("newUaName").value.trim(),
                     name: document.getElementById("newEngName").value.trim()
                   };

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (checkRules4AddUpdate(typeObj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(typeObj): updateElementOfGlobalDataArray(typeObj);
            createSettingsTypeTab_HTML();
            alertOfSuccess();
        });
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
            citiesLinkedToType += '<b>' + entityName(city) + '</b>, ';
        });
        document.getElementById("remove").innerHTML =
            '<div class="set-alert is-err">' + t('setLTypeNoDel') + ' ' +
            citiesLinkedToType.slice(0, -2) + t('setLTypeNoDelSuffix') + '</div>';
    }
    else {
        withSetContent(function(){
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
                alertOfDuplicateFailure(data.type[i].type_id, entityName(data.type[i]));
                result = false;
            }
        }
        else {
            if (data.type[i].type_id == typeObj.type_id.toUpperCase()){
                alertOfDuplicateFailure(data.type[i].type_id, entityName(data.type[i]));
                result = false;
            }
        }
        if (typeObj.type_id == ''){ alertOfEmptyMandatoryField("alert1"); result = false; }
        if (typeObj.name_ua == ''){ alertOfEmptyMandatoryField("alert2"); result = false; }
        if (typeObj.name == ''){ alertOfEmptyMandatoryField("alert3"); result = false; }
    }

    // On edit: if the ID was changed, block while cities still reference the OLD id
    // (same dependency rule as removal — otherwise those locations would be orphaned)
    if (initialTypeObj != "addnew" && typeObj.type_id !== '' && initialTypeObj.type_id != typeObj.type_id) {
        var dependents = $.grep (data.city, function( n, i ) {return (n.type == initialTypeObj.type_id)});
        if (dependents.length > 0) {
            var citiesLinked = "";
            $.each (dependents, function( i, city ){ citiesLinked += '<b>' + entityName(city) + '</b>, '; });
            document.getElementById("alert1").innerHTML =
                '<div class="set-alert is-err">' + t('setLTypeNoId') + ' ' +
                citiesLinked.slice(0, -2) + t('setLTypeNoIdSuffix') + '</div>';
            result = false;
        }
    }

    return result;
}

//10.06 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">' + t('setLTypeOk') + '</div>';
}

//10.07 Failure flag for not unique ID applied
function alertOfDuplicateFailure(id, name) {
    removeAllChildNodes("success");
    document.getElementById("alert1").innerHTML =
        '<div class="set-alert is-err">' + t('setDupIdPrefix') + ' <b>' + id + ' (' + name + ')</b>. ' + t('setDupIdSuffix') + '</div>';
}

//10.08 Failure flag for empty mandatory field
function alertOfEmptyMandatoryField(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">' + t('setEmptyField') + '</div>';
}