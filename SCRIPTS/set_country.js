//12. Settings Page - Country

//12.01 Main Country add, edit, removal section
function createSettingsCountryTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"country");
    local = [];
    local[1] = "country";

    // Set menu marker
    removeAllAttributesByName("class", "active", ".navbar-nav");
    document.getElementById("countries").setAttribute("class", "active")

    var options = '';
    $.each (data.country.sort(dynamicSort("name_ua")), function( i, country ){
        options += '<option value="' + country.short_name + '">' + country.name_ua + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">🗺️</span>' +
            '<div>' +
                '<h2 class="set-head-title">Країни</h2>' +
                '<p class="set-head-desc">Створюйте, редагуйте та видаляйте країни.</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="countrySelect">Оберіть країну або додайте нову</label>' +
            '<select id="countrySelect" class="set-select" onchange="javascript:onCountrySelect(this.value)">' +
                '<option value="">— оберіть —</option>' +
                '<option value="addnew">➕ Додати нову країну</option>' +
                options +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//12.02 Selection handler — render the form, or clear it when "— оберіть —" is chosen
function onCountrySelect(value) {
    if (value) { addEditRemoveCountry(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//12.02a Add/edit/remove form for a country
function addEditRemoveCountry(itemId) {
    var readonly = "", header = "Нова країна", submitStatus = "add";
    var removeButton = "", notAddedPicker = "";
    var country = (itemId != "addnew") ? $.grep (data.country, function( n, i ) {return ( n.short_name == itemId )}) : "newcountry";

    local[0] = {
        country_id:      (itemId != "addnew") ? country[0].country_id : "",
        country_type_id: (itemId != "addnew") ? (country[0].country_type_id || "") : "",
        continent_id:    (itemId != "addnew") ? country[0].continent_id : "",
        continent_id2:   (itemId != "addnew") ? (country[0].continent_id2 || "") : "",
        name:            (itemId != "addnew") ? country[0].name : "",
        name_ua:         (itemId != "addnew") ? country[0].name_ua : "",
        name_nt:         (itemId != "addnew") ? (country[0].name_nt || "") : "",
        small_flag_img:  (itemId != "addnew") ? (country[0].small_flag_img || "") : "",
        flag_img:        (itemId != "addnew") ? (country[0].flag_img || "") : "",
        emb_img:         (itemId != "addnew") ? (country[0].emb_img || "") : "",
        map_img:         (itemId != "addnew") ? (country[0].map_img || "") : "",
        short_name:      itemId
    };
    if (itemId != "addnew" && country[0].city_state != undefined) { local[0].city_state = country[0].city_state; }
    var cityStateInit = (local[0].city_state == "true");

    // continent options (sort a COPY — do not mutate data.continent order used elsewhere)
    var editMode = (itemId != "addnew");
    var sortedContinents = data.continent.slice().sort(dynamicSort("name_ua"));
    var continents = '<option value="0"' + (editMode ? "" : " selected") + '>— оберіть континент —</option>';
    $.each (sortedContinents, function( i, continent ) {
        var selected = (continent.continent_id == local[0].continent_id) ? " selected" : "";
        continents += "<option value='" + continent.continent_id + "'" + selected + ">" + continent.name_ua + "</option>";
    });
    // optional second continent (for cross-border countries, e.g. Spain)
    var continents2 = '<option value=""' + (local[0].continent_id2 ? "" : " selected") + '>— немає —</option>';
    $.each (sortedContinents, function( i, continent ) {
        var selected = (continent.continent_id == local[0].continent_id2) ? " selected" : "";
        continents2 += "<option value='" + continent.continent_id + "'" + selected + ">" + continent.name_ua + "</option>";
    });
    // country type (recognized / partially recognized / …) — every country has one
    var countryTypes = '<option value="0"' + (editMode ? "" : " selected") + '>— оберіть тип —</option>';
    $.each (data.country_type.slice().sort(dynamicSort("name_ua")), function( i, t ) {
        var selected = (t.country_type_id == local[0].country_type_id) ? " selected" : "";
        countryTypes += "<option value='" + t.country_type_id + "'" + selected + ">" + t.name_ua + "</option>";
    });

    if (editMode){
        readonly = "readonly";
        header = "Редагувати країну";
        submitStatus = "edit";
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:removeCountry()">Видалити країну</button>';
    }
    else {
        // offer countries that exist on the world map but are not in the base yet
        var distinctIds = {};
        $.each (data.country, function( i, c ) { distinctIds[c.country_id] = true; });
        $.ajax({ async: false, url: "SCRIPTS/MAPS/worldLow.js", dataType: "script" });
        var countryOptions = "";
        $.each (AmCharts.maps.worldLow.svg.g.path, function( i, newcountry ) {
            if (!distinctIds[newcountry.id]) {
                countryOptions += '<option value="' + newcountry.id + '">' + newcountry.title + '</option>';
            }
        });
        notAddedPicker =
            '<div class="set-field">' +
                '<label>Країна з карти світу, якої ще немає в базі</label>' +
                '<select id="newNotAddedMap" class="set-select" onchange="javascript:populateCountryForm(this.value)">' +
                    '<option value="0">— оберіть зі списку або пропустіть і введіть власну —</option>' +
                    countryOptions +
                '</select>' +
            '</div>';
    }

    var idVal = editMode ? ('value="' + local[0].country_id + '" ') : '';
    var snVal = editMode ? ('value="' + local[0].short_name + '" ') : '';

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            notAddedPicker +
            '<div class="set-field">' +
                '<label>ID країни (для прив’язки регіонів) <span class="req">*</span></label>' +
                '<input id="newId" type="text" class="set-input" placeholder="' + (editMode ? "ID не редагується" : "Унікальний ID країни") + '" ' + idVal + readonly + ' data-init="' + local[0].country_id + '" oninput="javascript:setCountryFormDirty()">' +
                '<span id="alert_id"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Коротка назва (для інтуїтивної прив’язки файлів, наприклад прапор або герб) <span class="req">*</span></label>' +
                '<input id="newShortName" type="text" class="set-input" placeholder="' + (editMode ? "не редагується" : "Унікальна коротка назва") + '" ' + snVal + readonly + ' data-init="' + local[0].short_name + '" oninput="javascript:setCountryFormDirty()">' +
                '<span id="alert_short_name"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва країни українською <span class="req">*</span></label>' +
                '<input id="newUaName" type="text" class="set-input" value="' + local[0].name_ua + '" placeholder="Напр.: Франція" data-init="' + local[0].name_ua + '" oninput="javascript:setCountryFormDirty()">' +
                '<span id="alert_name_ua"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва країни англійською <span class="req">*</span></label>' +
                '<input id="newEngName" type="text" class="set-input" value="' + local[0].name + '" placeholder="e.g. France" data-init="' + local[0].name + '" oninput="javascript:setCountryFormDirty()">' +
                '<span id="alert_name"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Рідна назва країни (мовою країни)</label>' +
                '<input id="newNtName" type="text" class="set-input" value="' + local[0].name_nt + '" placeholder="Напр.: France" data-init="' + local[0].name_nt + '" oninput="javascript:setCountryFormDirty()">' +
                '<span id="alert_name_nt"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Континент <span class="req">*</span></label>' +
                '<select id="newContinent" class="set-select" data-init="' + (editMode ? local[0].continent_id : "0") + '" onchange="javascript:setCountryFormDirty()">' +
                    continents +
                '</select>' +
                '<span id="alert_continent"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Другий континент (для крос-граничних країн)</label>' +
                '<select id="newContinent2" class="set-select" data-init="' + local[0].continent_id2 + '" onchange="javascript:setCountryFormDirty()">' +
                    continents2 +
                '</select>' +
                '<span id="alert_continent2"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Тип країни <span class="req">*</span></label>' +
                '<select id="newCountryType" class="set-select" data-init="' + (editMode ? local[0].country_type_id : "0") + '" onchange="javascript:setCountryFormDirty()">' +
                    countryTypes +
                '</select>' +
                '<span id="alert_country_type"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label class="set-check"><input type="checkbox" id="newCityState" data-init="' + (cityStateInit ? "true" : "false") + '" ' + (cityStateInit ? "checked" : "") + ' onchange="javascript:setCountryFormDirty()"> Місто-держава (дуже мала країна, що радше місто, ніж держава)</label>' +
                '<span id="alert_city_state"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Координати малого прапора <span class="req">*</span> ' +
                    '<a href="IMG/icon/smallClean35x35.png" target="_blank" rel="noopener" class="set-link">усі малі прапори ↗</a></label>' +
                '<div class="set-input-row">' +
                    '<input id="newSmallImg" type="text" class="set-input" value="' + local[0].small_flag_img + '" placeholder="Напр.: -507px -530px" data-init="' + local[0].small_flag_img + '" oninput="javascript:setCountryFormDirty(); setCountryBtns()">' +
                    '<button type="button" id="smallFlagBtn" class="set-btn" onclick="javascript:checkCountryFlag(\'newSmallImg\')">Перевірити</button>' +
                '</div>' +
                '<span id="alert_small_img"></span>' +
                '<div id="preview_newSmallImg" class="set-preview"></div>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Файл прапора (400×200)</label>' +
                '<div class="set-input-row">' +
                    '<input id="newFlagImg" type="text" class="set-input" value="' + local[0].flag_img + '" placeholder="Напр.: france_flag.png" data-init="' + local[0].flag_img + '" oninput="javascript:setCountryFormDirty(); setCountryBtns()">' +
                    '<button type="button" id="flagBtn" class="set-btn" onclick="javascript:checkCountryFlag(\'newFlagImg\')">Перевірити</button>' +
                '</div>' +
                '<span id="alert_flag_img"></span>' +
                '<div id="preview_newFlagImg" class="set-preview"></div>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Файл герба (200×200)</label>' +
                '<div class="set-input-row">' +
                    '<input id="newEmbImg" type="text" class="set-input" value="' + local[0].emb_img + '" placeholder="Напр.: france_emb.png" data-init="' + local[0].emb_img + '" oninput="javascript:setCountryFormDirty(); setCountryBtns()">' +
                    '<button type="button" id="embBtn" class="set-btn" onclick="javascript:checkCountryFlag(\'newEmbImg\')">Перевірити</button>' +
                '</div>' +
                '<span id="alert_emb_img"></span>' +
                '<div id="preview_newEmbImg" class="set-preview"></div>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Файл карти</label>' +
                '<div class="set-input-row">' +
                    '<input id="newMap" type="text" class="set-input" value="' + local[0].map_img + '" placeholder="Напр.: franceLow.js" data-init="' + local[0].map_img + '" oninput="javascript:setCountryFormDirty(); setCountryBtns()">' +
                    '<button type="button" id="mapBtn" class="set-btn" onclick="javascript:openCountryMap()">Відкрити карту</button>' +
                '</div>' +
                '<span id="alert_map"></span>' +
            '</div>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="countrySaveBtn" class="set-btn set-btn-primary" onclick="javascript:submitCountry(\'' + submitStatus + '\')" disabled>Зберегти</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';

    setCountryBtns();   // initial disabled state of the check/map buttons
}

//12.02a Disable the check/map buttons while their field is empty
function setCountryBtns() {
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    var set = function (id, on) { var b = document.getElementById(id); if (b) { b.disabled = !on; } };
    set("smallFlagBtn", val("newSmallImg") !== "");
    set("flagBtn", val("newFlagImg") !== "");
    set("embBtn", val("newEmbImg") !== "");
    set("mapBtn", val("newMap") !== "");
}

//12.02b Enable "Зберегти" only after a field actually changed (vs its initial value)
function setCountryFormDirty() {
    var els = document.querySelectorAll("#AddEditRemoveSection [data-init]");
    var dirty = false;
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var cur = (el.type === "checkbox") ? (el.checked ? "true" : "false") : el.value;
        if (cur !== el.getAttribute("data-init")) { dirty = true; break; }
    }
    var btn = document.getElementById("countrySaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//12.03 Submit changes for Add new or edit event
function submitCountry(status) {
    var newCountryObj = {
                     country_id: document.getElementById("newId").value.trim(),
                     country_type_id: document.getElementById("newCountryType").value.trim(),
                     continent_id: document.getElementById("newContinent").value.trim(),
                     name: document.getElementById("newEngName").value.trim(),
                     name_ua: document.getElementById("newUaName").value.trim(),
                     short_name: document.getElementById("newShortName").value.trim(),
                     small_flag_img: document.getElementById("newSmallImg").value.trim()
                   };

    var continent2 = document.getElementById("newContinent2").value.trim();
    if (continent2 != "" && continent2 != "0") { newCountryObj["continent_id2"] = continent2; }
    if (document.getElementById("newNtName").value.trim() != "") { newCountryObj["name_nt"] = document.getElementById("newNtName").value.trim(); }
    if (document.getElementById("newFlagImg").value.trim() != "") { newCountryObj["flag_img"] = document.getElementById("newFlagImg").value.trim(); }
    if (document.getElementById("newEmbImg").value.trim() != "") { newCountryObj["emb_img"] = document.getElementById("newEmbImg").value.trim(); }
    if (document.getElementById("newMap").value.trim() != "") { newCountryObj["map_img"] = document.getElementById("newMap").value.trim(); }
    if (document.getElementById('newCityState').checked) { newCountryObj["city_state"] = "true"; }

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ua");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_short_name");
    removeAllChildNodes("alert_continent");
    removeAllChildNodes("alert_small_img");
    removeAllChildNodes("success");

    if (checkCountryRules(newCountryObj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(newCountryObj): updateElementOfGlobalDataArray(newCountryObj);
            createSettingsCountryTab_HTML();
            countryAlertSuccess();
        });
    }
    return false;
}

//12.04 Remove item event handler
function removeCountry() {
    var newID = document.getElementById('newId').value;
    var dependents = $.grep (data.area, function( n, i ) {return (n.country_id == newID)});

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ua");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_short_name");
    removeAllChildNodes("alert_continent");
    removeAllChildNodes("success");
    removeAllChildNodes("alert_small_img");

    if (dependents.length > 0) {
        var linked = "";
        $.each (dependents, function( i, region ){ linked += '<b>' + region.name_ua + '</b>, '; });
        document.getElementById("remove").innerHTML =
            '<div class="set-alert is-err">Цю країну не можна видалити — від неї залежать регіони: ' +
            linked.slice(0, -2) + '. Спершу змініть їхню країну (або видаліть регіони).</div>';
    }
    else {
        withSetContent(function(){
            removeElementOfGlobalData4DefinedArray ("country_id", newID);
            createSettingsCountryTab_HTML();
            countryAlertSuccess();
        });
    }
}

//12.05 Verification for Add/Update fields
function checkCountryRules(countryObj) {
    var result = true;
    var initial = local[0];
    var isAdd = (initial.short_name == "addnew");

    for (var i = 0; i < data.country.length; i++) {
        if (!isAdd) {
            if (initial.country_id.toLowerCase() != countryObj.country_id.toLowerCase() && data.country[i].country_id.toLowerCase() == countryObj.country_id.toLowerCase()){
                countryAlertDupId(data.country[i].country_id, data.country[i].name_ua);
                result = false;
            }
            if (initial.short_name.toLowerCase() != countryObj.short_name.toLowerCase() && data.country[i].short_name.toLowerCase() == countryObj.short_name.toLowerCase()){
                countryAlertDupSN(data.country[i].short_name, data.country[i].name_ua);
                result = false;
            }
        }
        else {
            if (data.country[i].country_id.toLowerCase() == countryObj.country_id.toLowerCase()){
                countryAlertDupId(data.country[i].country_id, data.country[i].name_ua);
                result = false;
            }
            if (data.country[i].short_name.toLowerCase() == countryObj.short_name.toLowerCase()){
                countryAlertDupSN(data.country[i].short_name, data.country[i].name_ua);
                result = false;
            }
        }
    }

    if (countryObj.country_id == ''){ countryAlertEmpty("alert_id"); result = false; }
    if (countryObj.short_name == ''){ countryAlertEmpty("alert_short_name"); result = false; }
    if (countryObj.name_ua == ''){ countryAlertEmpty("alert_name_ua"); result = false; }
    if (countryObj.name == ''){ countryAlertEmpty("alert_name"); result = false; }
    if (countryObj.continent_id == '0'){ countryAlertEmpty("alert_continent"); result = false; }
    if (countryObj.country_type_id == '0' || countryObj.country_type_id == ''){ countryAlertEmpty("alert_country_type"); result = false; }
    if (countryObj.small_flag_img == ''){ countryAlertEmpty("alert_small_img"); result = false; }

    return result;
}

//12.06 Success flag
function countryAlertSuccess() {
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">Зміни успішно застосовано. Перевірте список країн.</div>';
}

//12.07 Failure flag for not unique ID
function countryAlertDupId(id, name_ua) {
    removeAllChildNodes("success");
    document.getElementById("alert_id").innerHTML =
        '<div class="set-alert is-err">Цей ID уже використовується: <b>' + id + ' (' + name_ua + ')</b>. Оберіть інший.</div>';
}

//12.08 Failure flag for not unique Short Name
function countryAlertDupSN(id, name_ua) {
    removeAllChildNodes("success");
    document.getElementById("alert_short_name").innerHTML =
        '<div class="set-alert is-err">Ця коротка назва вже використовується: <b>' + id + ' (' + name_ua + ')</b>. Оберіть іншу.</div>';
}

//12.09 Failure flag for empty mandatory field
function countryAlertEmpty(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">Обов’язкове поле порожнє. Заповніть його перед збереженням.</div>';
}

//12.10 Add image to verify if it looks good
function checkCountryFlag(id) {
    var image = document.getElementById(id).value.trim();
    var box = document.getElementById("preview_" + id);

    if (image != "") {
        switch(id) {
            case "newSmallImg":
                box.innerHTML = '<img src="IMG/icon/x.gif" class="countflag" style="background-position:' + image + '" />';
                break;
            case "newFlagImg":
                box.innerHTML = '<img alt="Прапор країни" title="Прапор країни" src="IMG/flag_n_emblem/' + image + '" class="country_flag">';
                break;
            case "newEmbImg":
                box.innerHTML = '<img alt="Герб країни" title="Герб країни" src="IMG/flag_n_emblem/' + image + '" class="country_emb">';
                break;
        }
    }
    else {
        if (box) { box.innerHTML = ""; }
        switch(id) {
            case "newSmallImg": countryAlertEmpty("alert_small_img"); break;
            case "newFlagImg":  countryAlertEmpty("alert_flag_img"); break;
            case "newEmbImg":   countryAlertEmpty("alert_emb_img"); break;
        }
    }
}

//12.11 Open Country map to check it
function openCountryMap() {
    var map = document.getElementById("newMap").value.trim();
    if (map != ""){
        window.open('map.html?map=' + map, '_blank');
    }
    else { countryAlertEmpty("alert_map"); }
}

//12.12 Populate add-new fields from the chosen world-map country
function populateCountryForm(id) {
    if (!id || id == "0") { return; }
    document.getElementById("newId").value = id;
    var e = document.getElementById("newNotAddedMap");
    document.getElementById("newEngName").value = e.options[e.selectedIndex].text;
    document.getElementById("newId").readOnly = true;
    setCountryFormDirty();
}
