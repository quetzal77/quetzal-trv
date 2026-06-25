//15. Settings Page - Visit

//15.01 Main Visit add, edit, removal section
function createSettingsVisitTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"visit");
    local = [];
    local[1] = "visit";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("visits").setAttribute("class", "active")

    var options = '';
    $.each (data.visit, function( i, visit ){
        var citiesList = "";
        $.each (visit.city, function( j, city ){ citiesList += getUaLocationName(city) + ", "; });
        citiesList = (citiesList.length > 55) ? citiesList.slice(0, 55) + "…" : citiesList.slice(0, -2);
        options += '<option value="' + visit.start_date + '">' + visit.start_date + ' — ' + citiesList + '</option>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">✈️</span>' +
            '<div>' +
                '<h2 class="set-head-title">Візити</h2>' +
                '<p class="set-head-desc">Створюйте, редагуйте та видаляйте візити (поїздки).</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="visitSelect">Оберіть візит або додайте новий</label>' +
            '<select id="visitSelect" class="set-select" onchange="javascript:onVisitSelect(this.value)">' +
                '<option value="">— оберіть —</option>' +
                '<option value="addnew">➕ Додати новий візит</option>' +
                options +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//15.02 Selection handler — render the form, or clear it when "— оберіть —" is chosen
function onVisitSelect(value) {
    if (value) { addEditRemoveVisits(value); }
    else { document.getElementById("AddEditRemoveSection").innerHTML = ""; }
}

//15.02a Add/edit/remove form for a visit
function addEditRemoveVisits(itemId) {
    var startDateValue = "", endDateValue = "", removeButton = "", firstSlice = "", secondSlice = "";
    var header = "Новий візит", submitStatus = "add";
    var editMode = (itemId != "addnew");
    var visit = editMode ? $.grep (data.visit, function( n, i ) {return ( n.start_date == itemId )}) : "newvisit";

    local[0] = {
        start_date: itemId,
        end_date: editMode ? visit[0].end_date : "",
        city: editMode ? visit[0].city : ""
    };
    if (editMode && visit[0].photos    != undefined) { local[0].photos = visit[0].photos; }
    if (editMode && visit[0].story     != undefined) { local[0].story = visit[0].story; }
    if (editMode && visit[0].story_url != undefined) { local[0].story_url = visit[0].story_url; }
    var photos = (local[0].photos != undefined) ? local[0].photos : "";

    // internal story (XML id) and external story (URL) are independent — a visit can have both
    var storyIds = {};
    $.each (visitsSorted, function( i, v ){ var sid = getStoryRefId(v); if (sid) { storyIds[sid] = true; } });
    var internalList = Object.keys(storyIds).sort();

    var curId = "", curExtUrl = (local[0].story_url || "");
    var curStory = local[0].story;
    if (curStory === true) {
        var p = (local[0].start_date || "").split(".");
        var ts = (p.length === 3) ? new Date(p[2], p[1] - 1, p[0]).getTime() : NaN;
        $.each (visitsSorted, function( i, v ){ if (v.start_date.getTime() === ts) { curId = getInternalStoryId(v); } });
    } else if (typeof curStory === "string" && curStory !== "") {
        if (isExternalStory(curStory)) { if (!curExtUrl) { curExtUrl = curStory; } }
        else { curId = curStory; }
    }
    if (curId && internalList.indexOf(curId) < 0) { internalList.push(curId); internalList.sort(); }

    if (editMode){
        startDateValue = 'value="' + local[0].start_date.replace(/\./g, "/") + '" ';
        endDateValue   = 'value="' + local[0].end_date.replace(/\./g, "/") + '" ';
        header = "Редагувати візит";
        submitStatus = "edit";
        removeButton = '<button type="button" class="set-btn set-btn-danger" onclick="javascript:removeVisit()">Видалити візит</button>';
        // keep the visited-cities order: list them first, already selected
        $.each (local[0].city, function( i, city ){
            firstSlice += '<option value="' + city + '" class="selected" selected>' + getEngLocationName(city) + '-' + getUaLocationName(city) + '</option>';
        });
    }

    // remaining (not-yet-selected) cities
    var distinctIds = {};
    $.each (local[0].city, function( i, city ){ distinctIds[city] = true; });
    $.each (data.city, function( i, city ){
        if (!distinctIds[city.city_id]){
            secondSlice += '<option value="' + city.city_id + '">' + city.name + '-' + city.name_ua + '</option>';
        }
    });

    // dirty-tracking snapshot (normalized)
    var norm = function (d) { return (d || "").replace(/[^0-9]/g, "."); };
    window.__visitInit = {
        start:  editMode ? norm(local[0].start_date) : "",
        end:    editMode ? norm(local[0].end_date) : "",
        cities: (editMode && local[0].city) ? local[0].city.slice().sort().join(",") : "",
        photos: photos,
        storyInt: curId,
        storyExt: curExtUrl
    };

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form">' +
            '<h3 class="set-form-title">' + header + '</h3>' +
            '<div class="set-field">' +
                '<div class="set-coord-row">' +
                    '<div class="set-coord"><label>Дата початку <span class="req">*</span></label>' +
                        '<input id="dateStart" name="date" type="text" class="set-input" ' + startDateValue + 'placeholder="ДД/ММ/РРРР"></div>' +
                    '<div class="set-coord"><label>Дата завершення <span class="req">*</span></label>' +
                        '<input id="dateEnd" name="date" type="text" class="set-input" ' + endDateValue + 'placeholder="ДД/ММ/РРРР"></div>' +
                '</div>' +
                '<span id="alert_date"></span>' +
            '</div>' +
            '<div class="set-field set-fcbk" onclick="javascript:setTimeout(setVisitFormDirty, 0)">' +
                '<label for="select3">Локації цієї поїздки <span class="req">*</span></label>' +
                '<select id="select3" name="select3">' + firstSlice + secondSlice + '</select>' +
                '<span id="alert_cities_list"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Посилання на фотоальбом поїздки</label>' +
                '<div class="set-input-row">' +
                    '<input id="newPhotos" type="text" class="set-input" value="' + photos + '" placeholder="URL фотоальбому" oninput="javascript:setVisitFormDirty(); document.getElementById(\'photoCheckBtn\').disabled = (this.value.trim() === \'\')">' +
                    '<button type="button" id="photoCheckBtn" class="set-btn" onclick="javascript:checkPhotoAlbum()"' + (photos ? "" : " disabled") + '>Переглянути</button>' +
                '</div>' +
                '<span id="alert_photos"></span>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Внутрішня історія (XML-файл)</label>' +
                '<select id="newStoryInt" class="set-select" onchange="javascript:setVisitFormDirty()">' +
                    '<option value=""' + (curId === "" ? " selected" : "") + '>— немає —</option>' +
                    internalList.map(function(id){ return '<option value="' + id + '"' + (curId === id ? " selected" : "") + '>' + id + '</option>'; }).join("") +
                '</select>' +
            '</div>' +
            '<div class="set-field">' +
                '<label>Зовнішня історія (посилання)</label>' +
                '<input id="newStoryExt" type="text" class="set-input" value="' + curExtUrl + '" placeholder="URL історії / блогу" oninput="javascript:setVisitFormDirty()">' +
                '<span id="alert_story"></span>' +
            '</div>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="visitSaveBtn" class="set-btn set-btn-primary" onclick="javascript:submitVisit(\'' + submitStatus + '\')" disabled>Зберегти</button>' +
                removeButton +
            '</div>' +
            '<span id="remove"></span>' +
        '</div>';

    // widgets
    runMultipleSelectWidget();
    runDatePickerWidget();

    // Populate the internal-story dropdown from the full catalog (DATA/stories.json),
    // falling back to ids scraped from existing visits if the index is missing.
    fillVisitStoryOptions(curId, internalList);
}

//15.02c Build the internal-story <select> from stories.json (full list) + fallback ids
function visitEsc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function fillVisitStoryOptions(curId, fallbackList) {
    var sel = document.getElementById("newStoryInt");
    if (!sel) { return; }
    curId = curId || "";

    var build = function (index) {
        var labels = {};                                                   // id -> display label
        (fallbackList || []).forEach(function (id) { labels[id] = id; });
        (index || []).forEach(function (s) { if (s && s.id) { labels[s.id] = s.id + (s.title ? " — " + s.title : ""); } });
        if (curId && !labels[curId]) { labels[curId] = curId; }

        var html = '<option value=""' + (curId === "" ? " selected" : "") + '>— немає —</option>';
        Object.keys(labels).sort().forEach(function (id) {
            html += '<option value="' + visitEsc(id) + '"' + (curId === id ? " selected" : "") + '>' + visitEsc(labels[id]) + '</option>';
        });
        sel.innerHTML = html;
    };

    if (window.__storiesIndex) { build(window.__storiesIndex); }
    else {
        $.getJSON("DATA/stories.json", function (idx) { window.__storiesIndex = idx; build(idx); })
         .fail(function () { /* index missing — keep the synchronously-built fallback list */ });
    }
}

//15.02b Enable "Зберегти" only after something actually changed
function setVisitFormDirty() {
    var init = window.__visitInit || {};
    var norm = function (d) { return (d || "").replace(/[^0-9]/g, "."); };
    var start  = norm($('#dateStart').val());
    var end    = norm($('#dateEnd').val());
    var cities = ($('#select3').val() || []).slice().sort().join(",");
    var photos = (((document.getElementById("newPhotos") || {}).value) || "").trim();
    var storyInt = (document.getElementById("newStoryInt") || {}).value || "";
    var storyExt = (((document.getElementById("newStoryExt") || {}).value) || "").trim();

    var dirty = (start !== init.start) || (end !== init.end) || (cities !== init.cities) ||
                (photos !== init.photos) || (storyInt !== init.storyInt) || (storyExt !== init.storyExt);
    var btn = document.getElementById("visitSaveBtn");
    if (btn) { btn.disabled = !dirty; }
}

//15.03 Remove item event handler (nothing references a visit, so no dependency guard)
function removeVisit() {
    removeAllChildNodes("alert_date");
    removeAllChildNodes("alert_cities_list");
    removeAllChildNodes("success");

    withSetContent(function(){
        removeElementOfGlobalData4DefinedArray ("start_date", local[0].start_date);
        createSettingsVisitTab_HTML();
        visitAlertSuccess();
    });
}

//15.04 Submit changes for Add new or edit event
function submitVisit(status) {
    var newVisitObj = {
                     start_date: $('#dateStart').val().replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "."),
                     end_date: $('#dateEnd').val().replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, ".")
                   };

    if ($('#select3').val() != "") { newVisitObj["city"] = $('#select3').val(); }
    if (document.getElementById("newPhotos").value.trim() != "") { newVisitObj["photos"] = document.getElementById("newPhotos").value.trim(); }
    var storyInt = document.getElementById("newStoryInt").value;
    if (storyInt != "") { newVisitObj["story"] = storyInt; }          // explicit internal XML file id
    var storyExt = document.getElementById("newStoryExt").value.trim();
    if (storyExt != "") { newVisitObj["story_url"] = storyExt; }       // external link

    removeAllChildNodes("alert_date");
    removeAllChildNodes("alert_cities_list");
    removeAllChildNodes("success");

    if (checkVisitRules(newVisitObj)) {
        withSetContent(function(){
            (status == "add") ? addElementOfGlobalDataArray(newVisitObj): updateElementOfGlobalDataArray(newVisitObj);
            createSettingsVisitTab_HTML();
            visitAlertSuccess();
        });
    }
    return false;
}

//15.05 Verification for Add/Update fields
function checkVisitRules(visitObj) {
    var result = true;
    var initial = local[0];
    var isAdd = (initial.start_date == "addnew");

    for (var i = 0; i < data.visit.length; i++) {
        if (!isAdd) {
            if (initial.start_date != visitObj.start_date && data.visit[i].start_date == visitObj.start_date){
                visitAlertDupStart(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
            if (initial.end_date != visitObj.end_date && data.visit[i].end_date == visitObj.end_date){
                visitAlertDupEnd(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
        }
        else {
            if (data.visit[i].start_date == visitObj.start_date){
                visitAlertDupStart(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
            if (data.visit[i].end_date == visitObj.end_date){
                visitAlertDupEnd(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
        }
    }

    if (visitObj.start_date == ''){ visitAlertEmpty("alert_date"); result = false; }
    if (visitObj.end_date == ''){ visitAlertEmpty("alert_date"); result = false; }
    if (visitObj.city == undefined){ visitAlertEmpty("alert_cities_list"); result = false; }

    return result;
}

//15.06 Success flag
function visitAlertSuccess() {
    document.getElementById("success").innerHTML =
        '<div class="set-alert is-ok">Зміни успішно застосовано. Перевірте список візитів.</div>';
}

//15.07 Failure flag — duplicate start date
function visitAlertDupStart(start_date, end_date) {
    removeAllChildNodes("success");
    document.getElementById("alert_date").innerHTML =
        '<div class="set-alert is-err">Дата початку не унікальна — вже є візит <b>' + start_date + ' - ' + end_date + '</b>. Оберіть іншу дату початку.</div>';
}

//15.08 Failure flag — duplicate end date
function visitAlertDupEnd(start_date, end_date) {
    removeAllChildNodes("success");
    document.getElementById("alert_date").innerHTML =
        '<div class="set-alert is-err">Дата завершення не унікальна — вже є візит <b>' + start_date + ' - ' + end_date + '</b>. Оберіть іншу дату завершення.</div>';
}

//15.09 Failure flag — empty mandatory field
function visitAlertEmpty(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="set-alert is-err">Обов’язкове поле порожнє. Заповніть його перед збереженням.</div>';
}

//15.10 Run multiselect widget (cities)
function runMultipleSelectWidget() {
    $("#select3").fcbkcomplete({
        width: '100%',
        height: 10,
        cache: true,
        newel: false,
        filter_case: false,
        filter_selected: false
    });
    // fcbkcomplete fires change on the underlying select when a city is added/removed
    $("#select3").on('change', function() { setVisitFormDirty(); });
}

//15.11 Run DatePicker widget
function runDatePickerWidget() {
    var date_input = $('input[name="date"]');
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
        clearBtn: true
    });
    // keep the dirty-state in sync with date changes
    date_input.on('changeDate change input', setVisitFormDirty);
}

//15.12 Open the photo album of the visit
function checkPhotoAlbum() {
    var url = document.getElementById("newPhotos").value.trim();
    if (url != ""){
        window.open(url, '_blank');
    }
    else { visitAlertEmpty("alert_photos"); }
}
