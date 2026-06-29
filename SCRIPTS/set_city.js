//11. Settings Page - City

//11.01 Main City add, edit, removal section
function createSettingsCityTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"city");
    local = [];
    local[1] = "city";

    // Set menu marker
    removeAllAttributesByName("class", "active", ".navbar-nav");
    document.getElementById("cities").setAttribute("class", "active")

    var nameKey = window.LANG === 'en' ? 'name' : 'name_ua';
    var options = '';
    $.each (data.country.sort(dynamicSort(nameKey)), function( i, country ){
        options += '<option value="' + country.short_name + '">' + (window.LANG === 'en' ? country.name : country.name_ua) + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">🏙️</span>' +
            '<div>' +
                '<h2 class="set-head-title">' + t('setLocations') + '</h2>' +
                '<p class="set-head-desc">' + t('setCityDesc') + '</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<div class="set-field">' +
                '<label for="cityCountrySelect">' + t('setCityCountryLabel') + '</label>' +
                '<select id="cityCountrySelect" class="set-select" onchange="javascript:showAllTheCitiesOfSelectedCountry(this.value)">' +
                    '<option value="">' + t('setCityCountry0') + '</option>' +
                    options +
                '</select>' +
            '</div>' +
            '<div id="CityListSection"></div>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//11.02 Country chosen — show its cities (or clear when "— оберіть —")
function showAllTheCitiesOfSelectedCountry(id) {
    document.getElementById("AddEditRemoveSection").innerHTML = "";
    if (!id) { document.getElementById("CityListSection").innerHTML = ""; return; }

    local[2] = id;
    var nameKey = window.LANG === 'en' ? 'name' : 'name_ua';
    var options = '';
    $.each (data.city.sort(dynamicSort(nameKey)), function( i, city ){
        var cityObj = new CityObj(city.city_id);
        var cityName = (window.LANG === 'en') ? city.name : (city.type ? getCityNameUpdatedUa(city.name_ua, city.type) : city.name_ua);
        if (cityObj.getCountryId() == id){
            options += '<option value="' + city.city_id + '">' + cityName + '</option>';
        }
    });

    document.getElementById("CityListSection").innerHTML =
        '<div class="set-field" style="margin-bottom:0">' +
            '<label for="citySelect">' + t('setCityLabel') + '</label>' +
            '<select id="citySelect" class="set-select" onchange="javascript:onCitySelect(this.value)">' +
                '<option value="">' + t('setSelectOpt') + '</option>' +
                '<option value="addnew">' + t('setCityAddNew') + '</option>' +
                options +
            '</select>' +
        '</div>';
}

//11.02a City chosen — render the form, or clear it
function onCitySelect(value) {
    if (value) { addEditRemoveCity(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//11.03 Add/edit/remove form for a city
function addEditRemoveCity(itemId) {
    var readonly = "", header = t('setCityNew'), submitStatus = "add", removeButton = "";
    var editMode = (itemId != "addnew");
    var city = editMode ? $.grep (data.city, function( n, i ) {return ( n.city_id == itemId )}) : "newcity";

    local[0] = {
        city_id: itemId,
        name_ua: editMode ? city[0].name_ua : "",
        name: editMode ? city[0].name : "",
        name_nt: editMode ? (city[0].name_nt || "") : "",
        region_id: editMode ? city[0].region_id : ""
    };
    if (editMode && city[0].capital     != undefined) { local[0].capital = city[0].capital; }
    if (editMode && city[0].type        != undefined) { local[0].type = city[0].type; }
    if (editMode && city[0].image       != undefined) { local[0].image = city[0].image; }
    if (editMode && city[0].lat         != undefined) { local[0].lat = city[0].lat; }
    if (editMode && city[0].lat_2       != undefined) { local[0].lat_2 = city[0].lat_2; }
    if (editMode && city[0].long        != undefined) { local[0].long = city[0].long; }
    if (editMode && city[0].long_2      != undefined) { local[0].long_2 = city[0].long_2; }
    if (editMode && city[0].description != undefined) { local[0].description = city[0].description; }

    var capital     = (local[0].capital == "true") ? "checked" : "";
    var image       = (local[0].image       != undefined) ? local[0].image : "";
    var lat         = (local[0].lat         != undefined) ? local[0].lat : "";
    var lat_2       = (local[0].lat_2       != undefined) ? local[0].lat_2 : "";
    var long        = (local[0].long        != undefined) ? local[0].long : "";
    var long_2      = (local[0].long_2      != undefined) ? local[0].long_2 : "";
    var description = (local[0].description != undefined) ? local[0].description : "";

    var nameKey = window.LANG === 'en' ? 'name' : 'name_ua';
    var regions = '';
    $.each (data.area.slice().sort(dynamicSort(nameKey)), function( i, region ) {
        if (region.country_id == getCountryId(local[2]) && region.active != "N") {
            var selected = (region.region_id == local[0].region_id) ? " selected" : "";
            regions += "<option value='" + region.region_id + "'" + selected + ">" + (window.LANG === 'en' ? region.name : region.name_ua) + "</option>";
        }
    });

    var types = '';
    $.each (data.type.slice().sort(dynamicSort(nameKey)), function( i, type ) {
        var selected = (type.type_id == local[0].type) ? " selected" : "";
        types += "<option value='" + type.type_id + "'" + selected + ">" + (window.LANG === 'en' ? type.name : type.name_ua) + "</option>";
    });

    if (editMode){
        readonly = "readonly";
        header = t('setCityEdit');
        submitStatus = "edit";
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:removeCity()">' + t('setCityDelete') + '</button>';
    }

    var idVal = editMode ? ('value="' + itemId + '" ') : '';

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            '<div class="set-field">' +
                '<label>' + t('setCityIdLabel') + ' <span class="req">*</span></label>' +
                '<input id="newId" type="text" class="set-input" placeholder="' + (editMode ? t('setIdFixed') : t('setCityIdHint')) + '" ' + idVal + readonly + ' oninput="javascript:setCityFormDirty()">' +
                '<span id="alert_id"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityNameUaLabel') + ' <span class="req">*</span></label>' +
                '<input id="newUaName" type="text" class="set-input" value="' + local[0].name_ua + '" placeholder="Напр.: Париж" oninput="javascript:setCityFormDirty()">' +
                '<span id="alert_name_ua"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityNameEnLabel') + ' <span class="req">*</span></label>' +
                '<input id="newEngName" type="text" class="set-input" value="' + local[0].name + '" placeholder="e.g. Paris" oninput="javascript:setCityFormDirty()">' +
                '<span id="alert_name"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityNtLabel') + '</label>' +
                '<input id="newNtName" type="text" class="set-input" value="' + local[0].name_nt + '" placeholder="Напр.: Paris" oninput="javascript:setCityFormDirty()">' +
                '<span id="alert_name_nt"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label class="set-check"><input type="checkbox" id="newCapital" ' + capital + ' onchange="javascript:setCityFormDirty()"> ' + t('setCityCapital') + '</label>' +
                '<span id="alert_capital"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityRegionLabel') + ' <span class="req">*</span></label>' +
                '<select id="newRegion" class="set-select" data-init="' + (local[0].region_id || "0") + '" onchange="javascript:setCityFormDirty()">' +
                    '<option value="0">' + t('setCityRegion0') + '</option>' +
                    regions +
                '</select>' +
                '<span id="alert_region"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityTypeLabel') + '</label>' +
                '<select id="newType" class="set-select" data-init="' + (local[0].type || "0") + '" onchange="javascript:setCityFormDirty()">' +
                    '<option value="0">' + t('setCityType0') + '</option>' +
                    types +
                '</select>' +
                '<span id="alert_type"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityImageLabel') + '</label>' +
                '<div class="set-input-row">' +
                    '<input id="newImage" type="text" class="set-input" value="' + image + '" placeholder="напр.: one.jpg,two.jpg" oninput="javascript:setCityFormDirty(); setCityBtns()">' +
                    '<button type="button" id="imgCheckBtn" class="set-btn" onclick="javascript:checkImage()">' + t('setCityCheckImg') + '</button>' +
                '</div>' +
                '<span id="alert_image"></span>' +
                '<div id="imgPreview" class="set-preview"></div>' +
            '</div>' +
            '<div class="set-field">' +
                '<div class="set-coord-row">' +
                    '<div class="set-coord"><label>' + t('setCityLat') + ' <span class="req">*</span></label>' +
                        '<input id="newLat" type="text" class="set-input" value="' + lat + '" oninput="javascript:setCityFormDirty(); setCityBtns()"></div>' +
                    '<div class="set-coord"><label>' + t('setCityLong') + ' <span class="req">*</span></label>' +
                        '<input id="newLong" type="text" class="set-input" value="' + long + '" oninput="javascript:setCityFormDirty(); setCityBtns()"></div>' +
                '</div>' +
                '<span id="alert_lat"></span><span id="alert_long"></span>' +
                '<div class="set-form-actions" style="margin-top:8px">' +
                    '<button type="button" id="gmapBtn" class="set-btn" onclick="javascript:openGoogleMap()">Google Maps</button>' +
                    '<button type="button" id="cmapBtn" class="set-btn" onclick="javascript:openCityMap()">' + t('setCityShowMap') + '</button>' +
                '</div>' +
            '</div>' +
            '<div class="set-field">' +
                '<div class="set-coord-row">' +
                    '<div class="set-coord"><label>' + t('setCityLat2') + ' <span class="ns-info" title="' + t('setCityLat2Hint') + '">і</span></label>' +
                        '<input id="newLat_2" type="text" class="set-input" value="' + lat_2 + '" oninput="javascript:setCityFormDirty(); setCityBtns()"></div>' +
                    '<div class="set-coord"><label>' + t('setCityLong2') + ' <span class="ns-info" title="' + t('setCityLong2Hint') + '">і</span></label>' +
                        '<input id="newLong_2" type="text" class="set-input" value="' + long_2 + '" oninput="javascript:setCityFormDirty(); setCityBtns()"></div>' +
                '</div>' +
                '<span id="alert_lat_2"></span><span id="alert_long_2"></span>' +
                '<div class="set-form-actions" style="margin-top:8px">' +
                    '<button type="button" id="gmap2Btn" class="set-btn" onclick="javascript:openSecondGoogleMap()">Google Maps</button>' +
                '</div>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>' + t('setCityDescLabel') + '</label>' +
                '<textarea id="newDescription" class="set-input" rows="5" placeholder="Напр.: Опис локації з переліком пам\'яток." oninput="javascript:setCityFormDirty()">' + description + '</textarea>' +
                '<span id="alert_description"></span>' +
            '</div>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="citySaveBtn" class="set-btn set-btn-primary" onclick="javascript:submitCity(\'' + submitStatus + '\')" disabled>' + t('setSave') + '</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';

    setCityBtns();   // set initial disabled state of the check/map buttons
}

//11.03a0 Disable the check/map buttons while their field(s) are empty
function setCityBtns() {
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    var hasImage = val("newImage") !== "";
    var hasCoord1 = val("newLat") !== "" && val("newLong") !== "";
    var hasCoord2 = val("newLat_2") !== "" && val("newLong_2") !== "";
    var set = function (id, on) { var b = document.getElementById(id); if (b) { b.disabled = !on; } };
    set("imgCheckBtn", hasImage);
    set("gmapBtn", hasCoord1);
    set("cmapBtn", hasCoord1);
    set("gmap2Btn", hasCoord2);
}

//11.03a Enable "Зберегти" only after a field actually changed (vs its initial value)
function setCityFormDirty() {
    var sec = document.getElementById("AddEditRemoveSection");
    var dirty = false;
    var fields = sec.querySelectorAll("input, textarea");
    for (var i = 0; i < fields.length && !dirty; i++) {
        var el = fields[i];
        if (el.type === "checkbox") { if (el.checked !== el.defaultChecked) { dirty = true; } }
        else if (el.value !== el.defaultValue) { dirty = true; }
    }
    var selects = sec.querySelectorAll("select[data-init]");
    for (var j = 0; j < selects.length && !dirty; j++) {
        if (selects[j].value !== selects[j].getAttribute("data-init")) { dirty = true; }
    }
    var btn = document.getElementById("citySaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//11.04 Remove item event handler
function removeCity() {
    var newID = document.getElementById('newId').value;
    var distinctIds = {};
    var dependents = [];
    $.each (visitsSorted, function( i, visit ) {
        $.each (visit.cities, function( j, city ) {
            if (city.city_id == newID && !distinctIds[visit.start_date]){
                dependents.push(visit);
                distinctIds[visit.start_date] = true;
            }
        });
    });

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ua");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_region");
    removeAllChildNodes("success");

    if (dependents.length > 0) {
        var linked = "";
        $.each (dependents, function( i, visit ){ linked += '<b>' + getVisitDate(visit.start_date, visit.end_date, true) + '</b>, '; });
        document.getElementById("remove").innerHTML =
            '<div class="set-alert is-err">' + t('setCityNoDel') + ' ' +
            linked.slice(0, -2) + t('setCityNoDelSuffix') + '</div>';
    }
    else {
        withSetContent(function(){
            removeElementOfGlobalData4DefinedArray ("city_id", newID);
            createSettingsCityTab_HTML();
            cityAlertSuccess();
        });
    }
}

//11.05 Submit changes for Add new or edit event
function submitCity(status) {
    var newCityObj = {
                     name: document.getElementById("newEngName").value.trim(),
                     name_nt: document.getElementById("newNtName").value.trim(),
                     name_ua: document.getElementById("newUaName").value.trim(),
                     city_id: document.getElementById("newId").value.trim()
                   };

    if (document.getElementById("newRegion").value != "0") { newCityObj["region_id"] = document.getElementById("newRegion").value; }
    if (document.getElementById("newType").value != "0") { newCityObj["type"] = document.getElementById("newType").value; }
    if (document.getElementById('newCapital').checked) { newCityObj["capital"] = "true"; }
    if (document.getElementById("newLat").value.trim() != "") { newCityObj["lat"] = document.getElementById("newLat").value.trim(); }
    if (document.getElementById("newLat_2").value.trim() != "") { newCityObj["lat_2"] = document.getElementById("newLat_2").value.trim(); }
    if (document.getElementById("newLong").value.trim() != "") { newCityObj["long"] = document.getElementById("newLong").value.trim(); }
    if (document.getElementById("newLong_2").value.trim() != "") { newCityObj["long_2"] = document.getElementById("newLong_2").value.trim(); }
    if (document.getElementById("newImage").value.trim() != "") { newCityObj["image"] = document.getElementById("newImage").value.trim(); }
    if (document.getElementById("newDescription").value.trim() != "") { newCityObj["description"] = document.getElementById("newDescription").value.trim(); }

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ua");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_region");
    removeAllChildNodes("alert_lat");
    removeAllChildNodes("alert_long");
    removeAllChildNodes("success");

    if (checkCityRules(newCityObj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(newCityObj): updateElementOfGlobalDataArray(newCityObj);
            createSettingsCityTab_HTML();
            cityAlertSuccess();
        });
    }
    return false;
}

//11.06 Verification for Add/Update fields
function checkCityRules(cityObj) {
    var result = true;
    var initial = local[0];
    var isAdd = (initial.city_id == "addnew");

    for (var i = 0; i < data.city.length; i++) {
        if (!isAdd) {
            if (initial.city_id.toLowerCase() != cityObj.city_id.toLowerCase() && data.city[i].city_id.toLowerCase() == cityObj.city_id.toLowerCase()){
                cityAlertDup(data.city[i].city_id, entityName(data.city[i]));
                result = false;
            }
        }
        else {
            if (data.city[i].city_id.toLowerCase() == cityObj.city_id.toLowerCase()){
                cityAlertDup(data.city[i].city_id, entityName(data.city[i]));
                result = false;
            }
        }
    }

    if (cityObj.city_id == ''){ cityAlertEmpty("alert_id"); result = false; }
    if (cityObj.name_ua == ''){ cityAlertEmpty("alert_name_ua"); result = false; }
    if (cityObj.name == ''){ cityAlertEmpty("alert_name"); result = false; }
    if (cityObj.region_id == undefined){ cityAlertEmpty("alert_region"); result = false; }
    if (cityObj.lat == undefined){ cityAlertEmpty("alert_lat"); result = false; }
    if (cityObj.long == undefined){ cityAlertEmpty("alert_long"); result = false; }

    return result;
}

//11.07 Success flag
function cityAlertSuccess() {
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">' + t('setCityOk') + '</div>';
}

//11.08 Failure flag for not unique ID
function cityAlertDup(id, name) {
    removeAllChildNodes("success");
    document.getElementById("alert_id").innerHTML =
        '<div class="set-alert is-err">' + t('setDupIdPrefix') + ' <b>' + id + ' (' + name + ')</b>. ' + t('setDupIdSuffix') + '</div>';
}

//11.09 Failure flag for empty mandatory field
function cityAlertEmpty(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">' + t('setEmptyField') + '</div>';
}

//11.10 Open Google map for lat/long
function openGoogleMap() {
    removeAllChildNodes("alert_lat");
    removeAllChildNodes("alert_long");
    var lat = document.getElementById("newLat").value.trim();
    var long = document.getElementById("newLong").value.trim();

    if (lat != "" && long != "") {
        window.open("https://www.google.com/maps/@" + lat + "," + long + ",12z", '_blank');
    }
    else {
        (lat == "") ? cityAlertEmpty("alert_lat") : cityAlertEmpty("alert_long");
    }
}

//11.11 Open Google map for the second lat/long
function openSecondGoogleMap() {
    removeAllChildNodes("alert_lat_2");
    removeAllChildNodes("alert_long_2");
    var lat_2 = document.getElementById("newLat_2").value.trim();
    var long_2 = document.getElementById("newLong_2").value.trim();

    if (lat_2 != "" && long_2 != "") {
        window.open("https://www.google.com/maps/@" + lat_2 + "," + long_2 + ",12z", '_blank');
    }
    else {
        (lat_2 == "") ? cityAlertEmpty("alert_lat_2") : cityAlertEmpty("alert_long_2");
    }
}

//11.12 Open the country map with the city marker
function openCityMap() {
    var lat = document.getElementById("newLat").value.trim();
    var long = document.getElementById("newLong").value.trim();
    var name = document.getElementById("newUaName").value.trim();
    var map = $.grep (data.country, function( n, i ) {return (n.short_name == local[2])});
    var city = name + "," + lat + "," + long;

    if (lat != "" && long != "" && name != "" && map[0]){
        window.open('map.html?map=' + map[0].map_img + '&city=' + city, '_blank');
    }
    else {
        if (lat == ""){ cityAlertEmpty("alert_lat"); }
        if (long == ""){ cityAlertEmpty("alert_long"); }
        if (name == ""){ cityAlertEmpty("alert_name_ua"); }
    }
}

//11.13 Preview the city image(s)
function checkImage() {
    var images = document.getElementById("newImage").value.trim();
    if (images != "") {
        var html = "";
        $.each (images.split(","), function( i, image ){
            html += '<img src="IMG/' + image + '" class="city_photo">';
        });
        document.getElementById("imgPreview").innerHTML = html;
    }
    else {
        cityAlertEmpty("alert_image");
    }
}