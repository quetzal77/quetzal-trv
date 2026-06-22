//10b. Settings Page - Country Types

//10b.01 Main Country Type add, edit, removal section
function createSettingsCountryTypeTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"country_type");
    local = [];
    local[1] = "country_type";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("ctypes").setAttribute("class", "active")

    var options = '';
    $.each (data.country_type.sort(dynamicSort("name_ua")), function( i, t ){
        options += '<option value="' + t.country_type_id + '">' + t.name_ua + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">🏳️</span>' +
            '<div>' +
                '<h2 class="set-head-title">Типи країн</h2>' +
                '<p class="set-head-desc">Створюйте, редагуйте та видаляйте типи країн.</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="ctypeSelect">Оберіть тип країни або додайте новий</label>' +
            '<select id="ctypeSelect" class="set-select" onchange="javascript:onCountryTypeSelect(this.value)">' +
                '<option value="">— оберіть —</option>' +
                '<option value="addnew">➕ Додати новий тип</option>' +
                options +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//10b.02 Selection handler — render the form, or clear it when "— оберіть —" is chosen
function onCountryTypeSelect(value) {
    if (value) { addEditRemoveCountryTypes(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//10b.02a Add/edit/remove form for a country type
function addEditRemoveCountryTypes(itemId) {
    var contValue = "", readonly = "", name = "", name_ua = "";
    var header = "Новий тип країни";
    var submitStatus = "add";
    var idHint = "Унікальний ID типу країни";
    var removeButton = "";
    local[0] = itemId;

    if (itemId != "addnew"){
        var t = $.grep (data.country_type, function( n, i ) {return (n.country_type_id == itemId)});
        if (!t[0]) { return; }
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";              // the ID is fixed once a type exists — it can no longer be edited
        idHint = "ID не редагується";
        header = "Редагувати тип країни";
        submitStatus = "edit";
        name_ua = t[0].name_ua;
        name = t[0].name;
        local[0] = {
            country_type_id: itemId,
            name_ua: t[0].name_ua,
            name: t[0].name
        };
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:removeCountryType()">Видалити тип</button>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            '<div class="set-field">' +
                '<label>ID типу <span class="req">*</span></label>' +
                '<input id="newId" type="text" class="set-input" placeholder="' + idHint + '" ' + contValue + readonly + ' oninput="javascript:setCountryTypeFormDirty()">' +
                '<span id="alert1"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва українською <span class="req">*</span></label>' +
                '<input id="newUaName" type="text" class="set-input" value="' + name_ua + '" placeholder="Напр.: Визнана країна" oninput="javascript:setCountryTypeFormDirty()">' +
                '<span id="alert2"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва англійською <span class="req">*</span></label>' +
                '<input id="newEngName" type="text" class="set-input" value="' + name + '" placeholder="e.g. Recognized country" oninput="javascript:setCountryTypeFormDirty()">' +
                '<span id="alert3"></span>' +
            '</div>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="ctypeSaveBtn" class="set-btn set-btn-primary" onclick="javascript:submitCountryType(\'' + submitStatus + '\')" disabled>Зберегти</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';
}

//10b.02b Enable "Зберегти" only after a field actually changed (vs its initial value)
function setCountryTypeFormDirty() {
    var ids = ["newId", "newUaName", "newEngName"], dirty = false;
    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el && el.value !== el.defaultValue) { dirty = true; break; }
    }
    var btn = document.getElementById("ctypeSaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//10b.03 Submit changes for Add new or edit event
function submitCountryType(status) {
    var obj = {
                  country_type_id: document.getElementById("newId").value.trim(),
                  name_ua: document.getElementById("newUaName").value.trim(),
                  name: document.getElementById("newEngName").value.trim()
              };

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (checkCountryTypeRules(obj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(obj): updateElementOfGlobalDataArray(obj);
            createSettingsCountryTypeTab_HTML();
            ctypeAlertSuccess();
        });
    }
    return false;
}

//10b.04 Remove item event handler
function removeCountryType() {
    var newID = document.getElementById('newId').value;
    var dependents = $.grep (data.country, function( n, i ) {return (n.country_type_id == newID)});

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (dependents.length > 0) {
        var linked = "";
        $.each (dependents, function( i, c ){ linked += '<b>' + c.name_ua + '</b>, '; });
        document.getElementById("remove").innerHTML =
            '<div class="set-alert is-err">Цей тип не можна видалити — від нього залежать країни: ' +
            linked.slice(0, -2) + '. Спершу змініть їхній тип.</div>';
    }
    else {
        withSetContent(function(){
            removeElementOfGlobalData4DefinedArray ("country_type_id", newID);
            createSettingsCountryTypeTab_HTML();
            ctypeAlertSuccess();
        });
    }
}

//10b.05 Verification for Add/Update fields
function checkCountryTypeRules(obj) {
    var result = true;
    var initial = local[0];
    for (var i = 0; i < data.country_type.length; i++) {
        if (initial != "addnew") {
            if (initial.country_type_id != obj.country_type_id && data.country_type[i].country_type_id == obj.country_type_id){
                ctypeAlertDuplicate(data.country_type[i].country_type_id, data.country_type[i].name_ua);
                result = false;
            }
        }
        else {
            if (data.country_type[i].country_type_id == obj.country_type_id){
                ctypeAlertDuplicate(data.country_type[i].country_type_id, data.country_type[i].name_ua);
                result = false;
            }
        }
    }
    if (obj.country_type_id == ''){ ctypeAlertEmpty("alert1"); result = false; }
    if (obj.name_ua == ''){ ctypeAlertEmpty("alert2"); result = false; }
    if (obj.name == ''){ ctypeAlertEmpty("alert3"); result = false; }

    // On edit: if the ID was changed, block while countries still reference the OLD id
    // (same dependency rule as removal — otherwise those countries would be orphaned)
    if (initial != "addnew" && obj.country_type_id !== '' && initial.country_type_id != obj.country_type_id) {
        var dependents = $.grep (data.country, function( n, i ) {return (n.country_type_id == initial.country_type_id)});
        if (dependents.length > 0) {
            var linked = "";
            $.each (dependents, function( i, c ){ linked += '<b>' + c.name_ua + '</b>, '; });
            document.getElementById("alert1").innerHTML =
                '<div class="set-alert is-err">ID не можна змінити — від попереднього ID залежать країни: ' +
                linked.slice(0, -2) + '. Спершу змініть їхній тип.</div>';
            result = false;
        }
    }

    return result;
}

//10b.06 Success flag
function ctypeAlertSuccess() {
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">Зміни успішно застосовано. Перевірте список типів країн.</div>';
}

//10b.07 Failure flag for not unique ID
function ctypeAlertDuplicate(id, name_ua) {
    removeAllChildNodes("success");
    document.getElementById("alert1").innerHTML =
        '<div class="set-alert is-err">Цей ID уже використовується: <b>' + id + ' (' + name_ua + ')</b>. Оберіть інший.</div>';
}

//10b.08 Failure flag for empty mandatory field
function ctypeAlertEmpty(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">Обов’язкове поле порожнє. Заповніть його перед збереженням.</div>';
}
