//09. Settings Page - Continents

//09.01 Main Continents add, edit, removal section
function createSettingsContinentTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"continent");
    local = [];
    local[1] = "continent";

    // Set menu marker
    removeAllAttributesByName("class", "active", ".navbar-nav");
    document.getElementById("continents").setAttribute("class", "active")

    var options = '';
    $.each (data.continent, function( i, continent ){
        options += '<option value="' + continent.continent_id + '">' + continent.name_ua + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">🌍</span>' +
            '<div>' +
                '<h2 class="set-head-title">Континенти</h2>' +
                '<p class="set-head-desc">Створюйте, редагуйте та видаляйте континенти.</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="contSelect">Оберіть континент або додайте новий</label>' +
            '<select id="contSelect" class="set-select" onchange="javascript:onContinentSelect(this.value)">' +
                '<option value="">— оберіть —</option>' +
                '<option value="addnew">➕ Додати новий континент</option>' +
                options +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//09.02 Selection handler — render the form, or clear it when "— оберіть —" is chosen
function onContinentSelect(value) {
    if (value) { addEditRemoveContinents(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//09.02a Add/edit/remove form for a continent
function addEditRemoveContinents(itemId) {
    var contValue = "", readonly = "", name = "", name_ua = "";
    var header = "Новий континент";
    var submitStatus = "add";
    var idHint = "Унікальний ID континенту (напр. EU)";
    var removeButton = "";
    local[0] = itemId;

    if (itemId != "addnew"){
        var continent = $.grep (data.continent, function( n, i ) {return (n.continent_id == itemId)});
        if (!continent[0]) { return; }
        contValue = 'value="' + itemId + '" ';
        readonly = "readonly";              // the ID is fixed once a continent exists — it can no longer be edited
        idHint = "ID не редагується";
        header = "Редагувати континент";
        submitStatus = "edit";
        name_ua = continent[0].name_ua;
        name = continent[0].name;
        local[0] = {
            continent_id: itemId,
            name_ua: continent[0].name_ua,
            name: continent[0].name
        };
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:removeContinent()">Видалити континент</button>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            '<div class="set-field">' +
                '<label>ID континенту <span class="req">*</span></label>' +
                '<input id="newId" type="text" class="set-input" placeholder="' + idHint + '" ' + contValue + readonly + ' oninput="javascript:setContinentFormDirty()">' +
                '<span id="alert1"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва українською <span class="req">*</span></label>' +
                '<input id="newUaName" type="text" class="set-input" value="' + name_ua + '" placeholder="Напр.: Європа" oninput="javascript:setContinentFormDirty()">' +
                '<span id="alert2"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва англійською <span class="req">*</span></label>' +
                '<input id="newEngName" type="text" class="set-input" value="' + name + '" placeholder="e.g. Europe" oninput="javascript:setContinentFormDirty()">' +
                '<span id="alert3"></span>' +
            '</div>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="contSaveBtn" class="set-btn set-btn-primary" onclick="javascript:submitContinent(\'' + submitStatus + '\')" disabled>Зберегти</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';
}

//09.02b Enable "Зберегти" only after a field actually changed (vs its initial value)
function setContinentFormDirty() {
    var ids = ["newId", "newUaName", "newEngName"], dirty = false;
    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el && el.value !== el.defaultValue) { dirty = true; break; }
    }
    var btn = document.getElementById("contSaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//09.03 Submit changes for Add new or edit event
function submitContinent(status) {
    var continentObj = {
                         continent_id: document.getElementById("newId").value.trim(),
                         name_ua: document.getElementById("newUaName").value.trim(),
                         name: document.getElementById("newEngName").value.trim()
                       };

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (checkContinentRules(continentObj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(continentObj): updateElementOfGlobalDataArray(continentObj);
            createSettingsContinentTab_HTML();
            continentAlertSuccess();
        });
    }
    return false;
}

//09.04 Remove item event handler
function removeContinent() {
    var newID = document.getElementById('newId').value;
    var dependents = $.grep (data.country, function( n, i ) {return (n.continent_id == newID || n.continent_id2 == newID)});

    removeAllChildNodes("alert1");
    removeAllChildNodes("alert2");
    removeAllChildNodes("alert3");
    removeAllChildNodes("success");

    if (dependents.length > 0) {
        var linked = "";
        $.each (dependents, function( i, country ){ linked += '<b>' + country.name_ua + '</b>, '; });
        document.getElementById("remove").innerHTML =
            '<div class="set-alert is-err">Цей континент не можна видалити — від нього залежать країни: ' +
            linked.slice(0, -2) + '. Спершу змініть їхній континент.</div>';
    }
    else {
        withSetContent(function(){
            removeElementOfGlobalData4DefinedArray ("continent_id", newID);
            createSettingsContinentTab_HTML();
            continentAlertSuccess();
        });
    }
}

//09.05 Verification for Add/Update fields
function checkContinentRules(continentObj) {
    var result = true;
    var initial = local[0];
    for (var i = 0; i < data.continent.length; i++) {
        if (initial != "addnew") {
            if (initial.continent_id.toUpperCase() != continentObj.continent_id.toUpperCase() && data.continent[i].continent_id.toUpperCase() == continentObj.continent_id.toUpperCase()){
                continentAlertDuplicate(data.continent[i].continent_id, data.continent[i].name_ua);
                result = false;
            }
        }
        else {
            if (data.continent[i].continent_id.toUpperCase() == continentObj.continent_id.toUpperCase()){
                continentAlertDuplicate(data.continent[i].continent_id, data.continent[i].name_ua);
                result = false;
            }
        }
    }
    if (continentObj.continent_id == ''){ continentAlertEmpty("alert1"); result = false; }
    if (continentObj.name_ua == ''){ continentAlertEmpty("alert2"); result = false; }
    if (continentObj.name == ''){ continentAlertEmpty("alert3"); result = false; }

    // On edit: if the ID was changed, block while countries still reference the OLD id
    // (same dependency rule as removal — otherwise those countries would be orphaned)
    if (initial != "addnew" && continentObj.continent_id !== '' && initial.continent_id != continentObj.continent_id) {
        var dependents = $.grep (data.country, function( n, i ) {return (n.continent_id == initial.continent_id || n.continent_id2 == initial.continent_id)});
        if (dependents.length > 0) {
            var linked = "";
            $.each (dependents, function( i, country ){ linked += '<b>' + country.name_ua + '</b>, '; });
            document.getElementById("alert1").innerHTML =
                '<div class="set-alert is-err">ID не можна змінити — від попереднього ID залежать країни: ' +
                linked.slice(0, -2) + '. Спершу змініть їхній континент.</div>';
            result = false;
        }
    }

    return result;
}

//09.06 Success flag
function continentAlertSuccess() {
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">Зміни успішно застосовано. Перевірте список континентів.</div>';
}

//09.07 Failure flag for not unique ID
function continentAlertDuplicate(id, name_ua) {
    removeAllChildNodes("success");
    document.getElementById("alert1").innerHTML =
        '<div class="set-alert is-err">Цей ID уже використовується: <b>' + id + ' (' + name_ua + ')</b>. Оберіть інший.</div>';
}

//09.08 Failure flag for empty mandatory field
function continentAlertEmpty(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">Обов’язкове поле порожнє. Заповніть його перед збереженням.</div>';
}
