//16. Settings Page - Story

// Object-row sections (key + fields). Labels and placeholders are bilingual.
function getStorySections() {
    var en = window.LANG === 'en';
    return [
        { key: "route",      label: en ? "Route"           : "Маршрут",
          fields: [{k:"date",l:en?"Date":"Дата",t:"date"},{k:"text",l:en?"Description":"Опис",t:"area"}] },
        { key: "transport",  label: en ? "Transport"       : "Транспорт",
          fields: [{k:"date",l:en?"Date":"Дата",t:"date"},{k:"type",l:en?"Type":"Тип"},{k:"from",l:en?"From":"Звідки"},{k:"to",l:en?"To":"Куди"},{k:"time",l:en?"Travel time":"Час у дорозі"},{k:"price",l:en?"Price":"Ціна",t:"number"},{k:"currency",l:en?"Currency":"Валюта"},{k:"text",l:en?"Description":"Опис",t:"area"}] },
        { key: "habitation", label: en ? "Accommodation"   : "Проживання",
          fields: [{k:"name",l:en?"Name":"Назва"},{k:"city",l:en?"City":"Місто"},{k:"nights",l:en?"Nights":"Ночей",t:"number"},{k:"room",l:en?"Room":"Номер"},{k:"price",l:en?"Price/night":"Ціна/ніч",t:"number"},{k:"currency",l:en?"Currency":"Валюта"},{k:"text",l:en?"Description":"Опис",t:"area"}] },
        { key: "sights",     label: en ? "Sights"          : "Визначні місця",
          fields: [{k:"name",l:en?"Name":"Назва"},{k:"city",l:en?"Location":"Локація"},{k:"price",l:en?"Price":"Ціна",t:"number"},{k:"currency",l:en?"Currency":"Валюта"},{k:"text",l:en?"Description":"Опис",t:"area"}] },
        { key: "food",       label: en ? "Food"            : "Харчування",
          fields: [{k:"name",l:en?"Name":"Назва"},{k:"price",l:en?"Price":"Ціна",t:"number"},{k:"currency",l:en?"Currency":"Валюта"},{k:"text",l:en?"Description":"Опис",t:"area"}] },
        { key: "souvenirs",  label: en ? "Souvenirs"       : "Сувеніри",
          fields: [{k:"name",l:en?"Name":"Назва"},{k:"num",l:en?"Qty":"К-сть",t:"number"},{k:"price",l:en?"Price":"Ціна",t:"number"},{k:"currency",l:en?"Currency":"Валюта"},{k:"text",l:en?"Description":"Опис",t:"area"}] },
        { key: "exrate",     label: en ? "Exchange rate"   : "Курс обміну",
          fields: [{k:"from",l:en?"From currency":"З валюти"},{k:"to",l:en?"To currency":"У валюту"},{k:"rate",l:en?"Rate":"Курс",t:"number"}] },
        { key: "links",      label: en ? "Links"           : "Посилання",
          fields: [{k:"url",l:"URL"},{k:"text",l:en?"Description":"Опис"}] }
    ];
}

// String-array sections — each entry is a single value (a row with one field + ×)
function getStoryStrSections() {
    var en = window.LANG === 'en';
    return [
        { key: "participants", label: en ? "Participants" : "Учасники", t: "text", placeholder: en ? "Participant name" : "Ім'я учасника" },
        { key: "visa",         label: en ? "Visa"         : "Віза",     t: "area", placeholder: en ? "Visa paragraph"   : "Абзац про візу" }
    ];
}

function storyEsc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function storyStrRowHTML(sec, val) {
    var input = (sec.t === "area")
        ? '<textarea class="set-input" data-k="v" rows="2" placeholder="' + sec.placeholder + '">' + storyEsc(val || "") + '</textarea>'
        : '<input class="set-input" data-k="v" type="text" value="' + storyEsc(val || "") + '" placeholder="' + sec.placeholder + '">';
    return '<div class="story-row">' + input + '<button type="button" class="set-btn story-del" onclick="javascript:storyDelRow(this)" title="' + t('setStoryDelRow') + '">×</button></div>';
}
function storyStrSectionHTML(sec, arr) {
    var rows = (arr || []).map(function (v) { return storyStrRowHTML(sec, v); }).join("");
    return '<div class="set-field"><label>' + sec.label + '</label>' +
        '<div class="story-rows" id="sec_' + sec.key + '">' + rows + '</div>' +
        '<button type="button" class="set-btn" onclick="javascript:storyAddStrRow(\'' + sec.key + '\')">' + t('setStoryAddRow') + '</button></div>';
}
function storyAddStrRow(key) {
    var sec = getStoryStrSections().filter(function (s) { return s.key === key; })[0];
    if (!sec) { return; }
    document.getElementById("sec_" + key).insertAdjacentHTML("beforeend", storyStrRowHTML(sec, ""));
    storyDirty();
}
function storyCollectStr(key) {
    var out = [];
    document.querySelectorAll("#sec_" + key + " .story-row").forEach(function (row) {
        var el = row.querySelector('[data-k="v"]');
        var v = el ? el.value.trim() : "";
        if (v !== "") { out.push(v); }
    });
    return out;
}

//16.01 Main Story add/edit section
function createSettingsStoryTab_HTML() {
    window.history.pushState("object or string", "Title", "index.html?settings="+"story");
    local = [];
    local[1] = "story";

    removeAllAttributesByName("class", "active", ".navbar-nav");
    document.getElementById("stories").setAttribute("class", "active");

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">📖</span>' +
            '<div>' +
                '<h2 class="set-head-title">' + t('setStories') + '</h2>' +
                '<p class="set-head-desc">' + t('setStoryDesc') + '</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="storySelect">' + t('setStorySelectLabel') + '</label>' +
            '<select id="storySelect" class="set-select" onchange="javascript:onStorySelect(this.value)">' +
                '<option value="">' + t('setStoryLoading') + '</option>' +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";

    $.getJSON("DATA/stories.json", function (idx) {
        window.__storyIndex = idx || [];
        var opts = '<option value="">' + t('setSelectOpt') + '</option><option value="__new__">' + t('setStoryAddNew') + '</option>';
        opts += window.__storyIndex.map(function (s) {
            var badge = s.language && s.language !== 'UA' ? ' [' + s.language + ']' : '';
            return '<option value="' + s.id + '">' + storyEsc(s.id + " — " + s.title + badge) + '</option>';
        }).join("");
        var sel = document.getElementById("storySelect");
        if (sel) { sel.innerHTML = opts; }
    });
}

//16.02 Selection handler — load & render, or clear
function onStorySelect(value) {
    if (!value) { document.getElementById("AddEditRemoveSection").innerHTML = ""; return; }
    if (value === "__new__") { renderStoryForm({}, false); return; }
    $.getJSON("DATA/stories/" + value + ".json", function (story) { renderStoryForm(story, true); });
}

//16.02a Build one row of an object-row section
function storyRowHTML(sec, item) {
    item = item || {};
    var inputs = sec.fields.map(function (f) {
        if (f.t === "area") {
            return '<textarea class="set-input story-f" data-k="' + f.k + '" rows="2" placeholder="' + f.l + '">' + storyEsc(item[f.k] || "") + '</textarea>';
        }
        var type = (f.t === "date") ? "date" : (f.t === "number") ? "number" : "text";
        return '<input class="set-input story-f" data-k="' + f.k + '" type="' + type + '" value="' + storyEsc(item[f.k] !== undefined ? item[f.k] : "") + '" placeholder="' + f.l + '">';
    }).join("");
    return '<div class="story-row">' + inputs + '<button type="button" class="set-btn story-del" onclick="javascript:storyDelRow(this)" title="' + t('setStoryDelRow') + '">×</button></div>';
}

//16.02b Build an object-row section block
function storySectionHTML(sec, arr) {
    var rows = (arr || []).map(function (it) { return storyRowHTML(sec, it); }).join("");
    return '<div class="set-field">' +
        '<label>' + sec.label + '</label>' +
        '<div class="story-rows" id="sec_' + sec.key + '">' + rows + '</div>' +
        '<button type="button" class="set-btn" onclick="javascript:storyAddRow(\'' + sec.key + '\')">' + t('setStoryAddRow') + '</button>' +
    '</div>';
}

//16.02c Custom narrative block (title + paragraphs)
function storyCustomRowHTML(item) {
    item = item || {};
    return '<div class="story-crow">' +
        '<input class="set-input st-ctitle" data-k="title" type="text" value="' + storyEsc(item.title || "") + '" placeholder="' + t('setStoryBlockTitle') + '">' +
        '<textarea class="set-input" data-k="body" rows="4" placeholder="' + t('setStoryBlockBody') + '">' + storyEsc((item.body || []).join("\n")) + '</textarea>' +
        '<button type="button" class="set-btn story-del" onclick="javascript:storyDelRow(this)" title="' + t('setStoryDelBlock') + '">×</button>' +
    '</div>';
}

//16.02d Prose section (array of paragraphs -> one textarea, paragraph per line)
function storyProseField(label, id, arr) {
    return '<div class="set-field"><label>' + label + '</label>' +
        '<textarea id="' + id + '" class="set-input" rows="4" placeholder="' + t('setStoryParaHint') + '">' + storyEsc((arr || []).join("\n")) + '</textarea></div>';
}

//16.02e Render the full edit form
function renderStoryForm(story, editMode) {
    var langVal = story.language || "UA";
    var idField = editMode
        ? '<input id="st_id" class="set-input" type="text" value="' + storyEsc(story.id) + '" readonly>'
        : '<input id="st_id" class="set-input" type="text" placeholder="e.g. 2015parisfrance">';

    var customRows = (story.custom || []).map(storyCustomRowHTML).join("");
    var strSections = getStoryStrSections();

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form" oninput="javascript:storyDirty()" onchange="javascript:storyDirty()">' +
            '<h3 class="set-form-title">' + (editMode ? t('setStoryEdit') : t('setStoryNew')) + '</h3>' +
            '<div class="set-field"><label>' + t('setStoryIdLabel') + ' <span class="req">*</span></label>' + idField + '</div>' +
            '<div class="set-field"><label>' + t('setStoryTitleLabel') + ' <span class="req">*</span></label>' +
                '<input id="st_title" class="set-input" type="text" value="' + storyEsc(story.title) + '"></div>' +
            '<div class="set-field"><label>' + t('setStoryShortLabel') + '</label>' +
                '<input id="st_short" class="set-input" type="text" value="' + storyEsc(story.short) + '"></div>' +
            '<div class="set-field"><label>' + t('setStoryLangLabel') + ' <span class="req">*</span></label>' +
                '<select id="st_lang" class="set-select">' +
                    '<option value="UA"' + (langVal === "UA" ? " selected" : "") + '>UA — Українська</option>' +
                    '<option value="EN"' + (langVal === "EN" ? " selected" : "") + '>EN — English</option>' +
                '</select></div>' +
            storyStrSectionHTML(strSections[0], story.participants) +
            storyStrSectionHTML(strSections[1], story.visa) +
            getStorySections().map(function (sec) { return storySectionHTML(sec, story[sec.key]); }).join("") +
            '<div class="set-field"><label>' + t('setStoryCustom') + '</label>' +
                '<div class="story-rows" id="sec_custom">' + customRows + '</div>' +
                '<button type="button" class="set-btn" onclick="javascript:storyAddCustom()">' + t('setStoryAddBlock') + '</button>' +
            '</div>' +
            storyProseField(t('setStorySummary'), "st_summary", story.summary) +
            '<span id="story_alert"></span>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="storySaveBtn" class="set-btn set-btn-primary" onclick="javascript:saveStory()" disabled>' + t('setStorySave') + '</button>' +
            '</div>' +
            '<textarea id="storyJsonOut" class="set-input story-json" rows="12" readonly style="display:none"></textarea>' +
        '</div>';
}

//16.03 Add / remove rows + dirty
function storyAddRow(key) {
    var sec = getStorySections().filter(function (s) { return s.key === key; })[0];
    if (!sec) { return; }
    document.getElementById("sec_" + key).insertAdjacentHTML("beforeend", storyRowHTML(sec, {}));
    storyDirty();
}
function storyAddCustom() {
    document.getElementById("sec_custom").insertAdjacentHTML("beforeend", storyCustomRowHTML({}));
    storyDirty();
}
function storyDelRow(btn) {
    var row = btn.closest(".story-row, .story-crow");
    if (row) { row.remove(); }
    storyDirty();
}
function storyDirty() {
    var b = document.getElementById("storySaveBtn");
    if (b) { b.disabled = false; }
}

//16.04 Collect helpers
function storyLines(id) {
    var el = document.getElementById(id);
    if (!el) { return []; }
    return el.value.split(/\n+/).map(function (s) { return s.trim(); }).filter(function (s) { return s !== ""; });
}
function storyCollectSection(sec) {
    var out = [];
    document.querySelectorAll("#sec_" + sec.key + " .story-row").forEach(function (row) {
        var obj = {};
        sec.fields.forEach(function (f) {
            var el = row.querySelector('[data-k="' + f.k + '"]');
            var v = el ? el.value.trim() : "";
            if (v !== "") { obj[f.k] = (f.t === "number" && !isNaN(Number(v))) ? Number(v) : v; }
        });
        if (Object.keys(obj).length) { out.push(obj); }
    });
    return out;
}
function storyCollectCustom() {
    var out = [];
    document.querySelectorAll("#sec_custom .story-crow").forEach(function (row) {
        var title = ((row.querySelector('[data-k="title"]') || {}).value || "").trim();
        var bodyEl = row.querySelector('[data-k="body"]');
        var body = bodyEl ? bodyEl.value.split(/\n+/).map(function (s) { return s.trim(); }).filter(function (s) { return s !== ""; }) : [];
        if (title || body.length) { out.push({ title: title, body: body }); }
    });
    return out;
}

//16.05 Build the story object and save (download JSON — no backend to write files)
function saveStory() {
    removeAllChildNodes("story_alert");
    var id = document.getElementById("st_id").value.trim();
    var title = document.getElementById("st_title").value.trim();
    if (id === "") { storyAlert("is-err", t('setStoryNoId')); return; }
    if (title === "") { storyAlert("is-err", t('setStoryNoTitle')); return; }

    var lang = document.getElementById("st_lang").value || "UA";
    var story = { id: id, language: lang, title: title };
    var short = document.getElementById("st_short").value.trim();
    if (short) { story.short = short; }
    var participants = storyCollectStr("participants"); if (participants.length) { story.participants = participants; }
    var visa = storyCollectStr("visa"); if (visa.length) { story.visa = visa; }
    getStorySections().forEach(function (sec) { var a = storyCollectSection(sec); if (a.length) { story[sec.key] = a; } });
    var custom = storyCollectCustom(); if (custom.length) { story.custom = custom; }
    var summary = storyLines("st_summary"); if (summary.length) { story.summary = summary; }

    var json = JSON.stringify(story, null, 2);
    var out = document.getElementById("storyJsonOut");
    out.style.display = ""; out.value = json;

    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json;charset=utf-8" }));
    a.download = id + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

    storyAlert("is-ok", t('setStorySavedOk') +
        "<br>1. " + t('setStorySavedStep1') + " <b>DATA/stories/" + id + ".json</b>." +
        "<br>2. " + t('setStorySavedStep2') +
        "<br>3. " + t('setStorySavedStep3'));
}

function storyAlert(kind, html) {
    document.getElementById("story_alert").innerHTML = '<div class="set-alert ' + kind + '">' + html + '</div>';
}