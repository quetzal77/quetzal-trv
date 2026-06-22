//14. Settings Page - Region

//14.01 Main Region add, edit, removal section
function createSettingsRegionTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"region");
    local = [];
    local[1] = "region";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("regions").setAttribute("class", "active")

    var options = '';
    $.each (data.country.sort(dynamicSort("name_ua")), function( i, country ){
        options += '<option value="' + country.country_id + '">' + country.name_ua + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">📍</span>' +
            '<div>' +
                '<h2 class="set-head-title">Регіони</h2>' +
                '<p class="set-head-desc">Створюйте, редагуйте та видаляйте регіони. Спершу оберіть країну.</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<div class="set-field">' +
                '<label for="regionCountrySelect">Країна</label>' +
                '<select id="regionCountrySelect" class="set-select" onchange="javascript:showAllTheRegionsOfSelectedCountry(this.value)">' +
                    '<option value="">— оберіть країну —</option>' +
                    options +
                '</select>' +
            '</div>' +
            '<div id="RegionListSection"></div>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//14.02 Country chosen — show its regions (or clear when "— оберіть —")
function showAllTheRegionsOfSelectedCountry(id) {
    document.getElementById("AddEditRemoveSection").innerHTML = "";
    if (!id) { document.getElementById("RegionListSection").innerHTML = ""; return; }

    var country = new CountryObj(id);
    local[2] = (country.map_img != undefined) ? country.map_img : country.short_name + "Low.js";
    local[3] = id;

    var options = '';
    $.each (data.area.sort(dynamicSort("name_ua")), function( i, region ){
        if (region.country_id == id && region.active != "N"){
            options += '<option value="' + region.region_id + '">' + region.name_ua + '</option>';
        }
    });

    document.getElementById("RegionListSection").innerHTML =
        '<div class="set-field" style="margin-bottom:0">' +
            '<label for="regionSelect">Регіон</label>' +
            '<select id="regionSelect" class="set-select" onchange="javascript:onRegionSelect(this.value)">' +
                '<option value="">— оберіть —</option>' +
                '<option value="addnew">➕ Додати новий регіон</option>' +
                options +
            '</select>' +
        '</div>';
}

//14.02a Region chosen — render the form, or clear it
function onRegionSelect(value) {
    if (value) { addEditRemoveRegion(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//14.03 Add/edit/remove form for a region
function addEditRemoveRegion(itemId) {
    var readonly = "", header = "Новий регіон", submitStatus = "add";
    var removeButton = "", notAddedPicker = "", mapButton = "", disabled = "";
    var error = false; // true if the country map js does not exist
    var editMode = (itemId != "addnew");
    var region = editMode ? $.grep (data.area, function( n, i ) {return ( n.region_id == itemId )}) : "newregion";

    local[0] = {
        country_id: local[3],
        region_id: itemId,
        name: editMode ? region[0].name : "",
        name_ua: editMode ? region[0].name_ua : "",
        active: editMode ? (region[0].active || "") : ""
    };
    var activeInit = (local[0].active == "Y");

    var countries = '';
    $.each (data.country.slice().sort(dynamicSort("name_ua")), function( i, country ) {
        var selected = (country.country_id == local[3]) ? " selected" : "";
        countries += "<option value='" + country.country_id + "'" + selected + ">" + country.name_ua + "</option>";
    });

    // try to load the country's map (for the "not yet added" picker and the map-check button)
    $.ajax({ async: false, url: "SCRIPTS/MAPS/" + local[2], dataType: "script", error: function () { error = true; } });

    if (editMode){
        readonly = "readonly";
        header = "Редагувати регіон";
        submitStatus = "edit";
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:removeRegion()">Видалити регіон</button>';
    }
    else {
        disabled = 'disabled="disabled"';   // в режимі додавання країна зафіксована обраною вище
        if (!error) {
            var distinctIds = {};
            $.each (data.area, function( i, oldregion ) { if (oldregion.country_id == local[3]) { distinctIds[oldregion.region_id] = true; } });
            var low = eval("AmCharts.maps." + local[2].slice(0, -3));
            var regionOptions = "";
            $.each (low.svg.g.path, function( i, newregion ) {
                if (!distinctIds[newregion.id]) {
                    regionOptions += '<option value="' + newregion.id + '">' + newregion.title + '</option>';
                }
            });
            notAddedPicker =
                '<div class="set-field">' +
                    '<label>Регіон з карти країни, якого ще немає в базі</label>' +
                    '<select id="newNotAddedRegion" class="set-select" onchange="javascript:populateRegionForm(this.value)">' +
                        '<option value="0">— оберіть зі списку або пропустіть і введіть власний —</option>' +
                        regionOptions +
                    '</select>' +
                '</div>';
        }
    }

    if (!error) {
        mapButton = '<button type="button" class="set-btn" onclick="javascript:openRegionMap()">Показати регіон на карті країни</button>';
    }

    var idVal = editMode ? ('value="' + local[0].region_id + '" ') : '';

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            notAddedPicker +
            '<div class="set-field">' +
                '<label>ID регіону <span class="req">*</span></label>' +
                '<input id="newId" type="text" class="set-input" placeholder="' + (editMode ? "ID не редагується" : "Унікальний ID регіону") + '" ' + idVal + readonly + ' data-init="' + local[0].region_id + '" oninput="javascript:setRegionFormDirty()">' +
                '<span id="alert_id"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва регіону українською <span class="req">*</span></label>' +
                '<input id="newUaName" type="text" class="set-input" value="' + local[0].name_ua + '" placeholder="Напр.: Іль-де-Франс" data-init="' + local[0].name_ua + '" oninput="javascript:setRegionFormDirty()">' +
                '<span id="alert_name_ua"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Назва регіону англійською <span class="req">*</span></label>' +
                '<input id="newEngName" type="text" class="set-input" value="' + local[0].name + '" placeholder="e.g. Île-de-France" data-init="' + local[0].name + '" oninput="javascript:setRegionFormDirty()">' +
                '<span id="alert_name"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label class="set-check"><input type="checkbox" id="newActive" data-init="' + (activeInit ? "true" : "false") + '" ' + (activeInit ? "checked" : "") + ' onchange="javascript:setRegionFormDirty()"> Відображати регіон для цієї країни на порталі</label>' +
                '<span id="alert_active"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Прив’язати регіон до країни зі списку <span class="req">*</span></label>' +
                '<select id="newCountry" class="set-select" ' + disabled + ' data-init="' + local[3] + '" onchange="javascript:setRegionFormDirty()">' +
                    '<option value="0">— оберіть країну —</option>' +
                    countries +
                '</select>' +
                '<span id="alert_country"></span>' +
            '</div>' +
            (mapButton ? '<div class="set-field">' + mapButton + '</div>' : '') +
            '<div class="set-form-actions">' +
                '<button type="button" id="regionSaveBtn" class="set-btn set-btn-primary" onclick="javascript:submitRegion(\'' + submitStatus + '\')" disabled>Зберегти</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';
}

//14.03a Enable "Зберегти" only after a field actually changed (vs its initial value)
function setRegionFormDirty() {
    var els = document.querySelectorAll("#AddEditRemoveSection [data-init]");
    var dirty = false;
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var cur = (el.type === "checkbox") ? (el.checked ? "true" : "false") : el.value;
        if (cur !== el.getAttribute("data-init")) { dirty = true; break; }
    }
    var btn = document.getElementById("regionSaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//14.04 Remove item event handler
function removeRegion() {
    var newID = document.getElementById('newId').value;
    var dependents = $.grep (data.city, function( n, i ) {return (n.region_id == newID)});

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ua");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_active");
    removeAllChildNodes("alert_country");
    removeAllChildNodes("success");

    if (dependents.length > 0) {
        var linked = "";
        $.each (dependents, function( i, city ){ linked += '<b>' + city.name_ua + '</b>, '; });
        document.getElementById("remove").innerHTML =
            '<div class="set-alert is-err">Цей регіон не можна видалити — від нього залежать локації: ' +
            linked.slice(0, -2) + '. Спершу змініть їхній регіон (або видаліть локації).</div>';
    }
    else {
        withSetContent(function(){
            removeElementOfGlobalData4DefinedArray ("region_id", newID);
            createSettingsRegionTab_HTML();
            regionAlertSuccess();
        });
    }
}

//14.05 Submit changes for Add new or edit event
function submitRegion(status) {
    var newRegionObj = {
                     country_id: document.getElementById("newCountry").value.trim(),
                     region_id: document.getElementById("newId").value.trim(),
                     name: document.getElementById("newEngName").value.trim(),
                     name_ua: document.getElementById("newUaName").value.trim(),
                     active: (document.getElementById("newActive").checked) ? "Y" : "N"
                   };

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ua");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_active");
    removeAllChildNodes("alert_country");
    removeAllChildNodes("success");

    if (checkRegionRules(newRegionObj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(newRegionObj): updateElementOfGlobalDataArray(newRegionObj);
            createSettingsRegionTab_HTML();
            regionAlertSuccess();
        });
    }
    return false;
}

//14.06 Verification for Add/Update fields
function checkRegionRules(regionObj) {
    var result = true;
    var initial = local[0];
    var isAdd = (initial.region_id == "addnew");

    for (var i = 0; i < data.area.length; i++) {
        if (!isAdd) {
            if (initial.region_id.toLowerCase() != regionObj.region_id.toLowerCase() && data.area[i].region_id.toLowerCase() == regionObj.region_id.toLowerCase()){
                regionAlertDupId(data.area[i].region_id, data.area[i].name_ua);
                result = false;
            }
        }
        else {
            if (data.area[i].region_id.toLowerCase() == regionObj.region_id.toLowerCase()){
                regionAlertDupId(data.area[i].region_id, data.area[i].name_ua);
                result = false;
            }
        }
    }

    if (regionObj.country_id == '0'){ regionAlertEmpty("alert_country"); result = false; }
    if (regionObj.region_id == ''){ regionAlertEmpty("alert_id"); result = false; }
    if (regionObj.name_ua == ''){ regionAlertEmpty("alert_name_ua"); result = false; }
    if (regionObj.name == ''){ regionAlertEmpty("alert_name"); result = false; }

    return result;
}

//14.07 Success flag
function regionAlertSuccess() {
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">Зміни успішно застосовано. Перевірте список регіонів.</div>';
}

//14.08 Failure flag for empty mandatory field
function regionAlertEmpty(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">Обов’язкове поле порожнє. Заповніть його перед збереженням.</div>';
}

//14.09 Failure flag for not unique ID
function regionAlertDupId(id, name_ua) {
    removeAllChildNodes("success");
    document.getElementById("alert_id").innerHTML =
        '<div class="set-alert is-err">Цей ID уже використовується: <b>' + id + ' (' + name_ua + ')</b>. Оберіть інший.</div>';
}

//14.10 Populate add-new fields from the chosen country-map region
function populateRegionForm(id) {
    if (!id || id == "0") { return; }
    document.getElementById("newId").value = id;
    var e = document.getElementById("newNotAddedRegion");
    document.getElementById("newEngName").value = e.options[e.selectedIndex].text;
    document.getElementById("newId").readOnly = true;
    setRegionFormDirty();
}

//14.11 Open the country map highlighting this region
function openRegionMap() {
    var map = local[2];
    var region = document.getElementById("newId").value;
    if (map != ""){
        window.open('map.html?map=' + map + '&region=' + region, '_blank');
    }
    else { regionAlertEmpty("alert_id"); }
}
