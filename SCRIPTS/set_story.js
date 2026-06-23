//16. Settings Page - Story

// Object-row sections (key + fields). Prose sections (participants/visa/summary) and
// the custom narrative blocks are handled separately below.
var STORY_SECTIONS = [
    { key: "route",      label: "Маршрут",          fields: [{k:"date",l:"Дата",t:"date"},{k:"text",l:"Опис",t:"area"}] },
    { key: "transport",  label: "Транспорт",        fields: [{k:"date",l:"Дата",t:"date"},{k:"type",l:"Тип"},{k:"from",l:"Звідки"},{k:"to",l:"Куди"},{k:"time",l:"Час у дорозі"},{k:"price",l:"Ціна",t:"number"},{k:"currency",l:"Валюта"},{k:"text",l:"Опис",t:"area"}] },
    { key: "habitation", label: "Проживання",       fields: [{k:"name",l:"Назва"},{k:"city",l:"Місто"},{k:"nights",l:"Ночей",t:"number"},{k:"room",l:"Номер"},{k:"price",l:"Ціна/ніч",t:"number"},{k:"currency",l:"Валюта"},{k:"text",l:"Опис",t:"area"}] },
    { key: "sights",     label: "Визначні місця",   fields: [{k:"name",l:"Назва"},{k:"city",l:"Локація"},{k:"price",l:"Ціна",t:"number"},{k:"currency",l:"Валюта"},{k:"text",l:"Опис",t:"area"}] },
    { key: "food",       label: "Харчування",       fields: [{k:"name",l:"Назва"},{k:"price",l:"Ціна",t:"number"},{k:"currency",l:"Валюта"},{k:"text",l:"Опис",t:"area"}] },
    { key: "souvenirs",  label: "Сувеніри",         fields: [{k:"name",l:"Назва"},{k:"num",l:"К-сть",t:"number"},{k:"price",l:"Ціна",t:"number"},{k:"currency",l:"Валюта"},{k:"text",l:"Опис",t:"area"}] },
    { key: "exrate",     label: "Курс обміну",      fields: [{k:"from",l:"З валюти"},{k:"to",l:"У валюту"},{k:"rate",l:"Курс",t:"number"}] },
    { key: "links",      label: "Посилання",        fields: [{k:"url",l:"URL"},{k:"text",l:"Опис"}] }
];

// String-array sections — each entry is a single value (a row with one field + ×)
var STORY_STR_SECTIONS = [
    { key: "participants", label: "Учасники", t: "text", placeholder: "Ім'я учасника" },
    { key: "visa",         label: "Віза",     t: "area", placeholder: "Абзац про візу" }
];

function storyEsc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function storyStrRowHTML(sec, val) {
    var input = (sec.t === "area")
        ? '<textarea class="set-input" data-k="v" rows="2" placeholder="' + sec.placeholder + '">' + storyEsc(val || "") + '</textarea>'
        : '<input class="set-input" data-k="v" type="text" value="' + storyEsc(val || "") + '" placeholder="' + sec.placeholder + '">';
    return '<div class="story-row">' + input + '<button type="button" class="set-btn story-del" onclick="javascript:storyDelRow(this)" title="Видалити рядок">×</button></div>';
}
function storyStrSectionHTML(sec, arr) {
    var rows = (arr || []).map(function (v) { return storyStrRowHTML(sec, v); }).join("");
    return '<div class="set-field"><label>' + sec.label + '</label>' +
        '<div class="story-rows" id="sec_' + sec.key + '">' + rows + '</div>' +
        '<button type="button" class="set-btn" onclick="javascript:storyAddStrRow(\'' + sec.key + '\')">➕ Додати рядок</button></div>';
}
function storyAddStrRow(key) {
    var sec = STORY_STR_SECTIONS.filter(function (s) { return s.key === key; })[0];
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

    removeAllAttributesByName("class", "active");
    document.getElementById("stories").setAttribute("class", "active");

    document.getElementById("rightSettingsSection").innerHTML =
        '<header class="set-head">' +
            '<span class="set-head-icon">📖</span>' +
            '<div>' +
                '<h2 class="set-head-title">Історії</h2>' +
                '<p class="set-head-desc">Створюйте та редагуйте історії подорожей. Збереження формує JSON-файл для завантаження.</p>' +
            '</div>' +
        '</header>' +
        '<span id="success"></span>' +
        '<div class="set-panel">' +
            '<label class="set-label" for="storySelect">Оберіть історію або додайте нову</label>' +
            '<select id="storySelect" class="set-select" onchange="javascript:onStorySelect(this.value)">' +
                '<option value="">— завантаження… —</option>' +
            '</select>' +
        '</div>' +
        '<div id="AddEditRemoveSection"></div>';

    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";

    $.getJSON("DATA/stories.json", function (idx) {
        window.__storyIndex = idx || [];
        var opts = '<option value="">— оберіть —</option><option value="__new__">➕ Додати нову історію</option>';
        opts += window.__storyIndex.map(function (s) { return '<option value="' + s.id + '">' + storyEsc(s.id + " — " + s.title) + '</option>'; }).join("");
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
    return '<div class="story-row">' + inputs + '<button type="button" class="set-btn story-del" onclick="javascript:storyDelRow(this)" title="Видалити рядок">×</button></div>';
}

//16.02b Build an object-row section block
function storySectionHTML(sec, arr) {
    var rows = (arr || []).map(function (it) { return storyRowHTML(sec, it); }).join("");
    return '<div class="set-field">' +
        '<label>' + sec.label + '</label>' +
        '<div class="story-rows" id="sec_' + sec.key + '">' + rows + '</div>' +
        '<button type="button" class="set-btn" onclick="javascript:storyAddRow(\'' + sec.key + '\')">➕ Додати рядок</button>' +
    '</div>';
}

//16.02c Custom narrative block (title + paragraphs)
function storyCustomRowHTML(item) {
    item = item || {};
    return '<div class="story-crow">' +
        '<input class="set-input st-ctitle" data-k="title" type="text" value="' + storyEsc(item.title || "") + '" placeholder="Заголовок блоку">' +
        '<textarea class="set-input" data-k="body" rows="4" placeholder="Текст (абзац у рядку)">' + storyEsc((item.body || []).join("\n")) + '</textarea>' +
        '<button type="button" class="set-btn story-del" onclick="javascript:storyDelRow(this)" title="Видалити блок">×</button>' +
    '</div>';
}

//16.02d Prose section (array of paragraphs -> one textarea, paragraph per line)
function storyProseField(label, id, arr) {
    return '<div class="set-field"><label>' + label + '</label>' +
        '<textarea id="' + id + '" class="set-input" rows="4" placeholder="Один абзац у рядку">' + storyEsc((arr || []).join("\n")) + '</textarea></div>';
}

//16.02e Render the full edit form
function renderStoryForm(story, editMode) {
    var idField = editMode
        ? '<input id="st_id" class="set-input" type="text" value="' + storyEsc(story.id) + '" readonly>'
        : '<input id="st_id" class="set-input" type="text" placeholder="Напр.: 2015parisfrance (ім\'я файлу)">';

    var customRows = (story.custom || []).map(storyCustomRowHTML).join("");

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<div class="set-panel set-form" oninput="javascript:storyDirty()" onchange="javascript:storyDirty()">' +
            '<h3 class="set-form-title">' + (editMode ? "Редагувати історію" : "Нова історія") + '</h3>' +
            '<div class="set-field"><label>ID історії (ім\'я файлу) <span class="req">*</span></label>' + idField + '</div>' +
            '<div class="set-field"><label>Заголовок <span class="req">*</span></label><input id="st_title" class="set-input" type="text" value="' + storyEsc(story.title) + '"></div>' +
            '<div class="set-field"><label>Короткий опис</label><input id="st_short" class="set-input" type="text" value="' + storyEsc(story.short) + '"></div>' +
            storyStrSectionHTML(STORY_STR_SECTIONS[0], story.participants) +
            storyStrSectionHTML(STORY_STR_SECTIONS[1], story.visa) +
            STORY_SECTIONS.map(function (sec) { return storySectionHTML(sec, story[sec.key]); }).join("") +
            '<div class="set-field"><label>Розповідь (текстові блоки)</label>' +
                '<div class="story-rows" id="sec_custom">' + customRows + '</div>' +
                '<button type="button" class="set-btn" onclick="javascript:storyAddCustom()">➕ Додати блок</button>' +
            '</div>' +
            storyProseField("Підсумки (абзац у рядку)", "st_summary", story.summary) +
            '<span id="story_alert"></span>' +
            '<div class="set-form-actions">' +
                '<button type="button" id="storySaveBtn" class="set-btn set-btn-primary" onclick="javascript:saveStory()" disabled>Зберегти (завантажити JSON)</button>' +
            '</div>' +
            '<textarea id="storyJsonOut" class="set-input story-json" rows="12" readonly style="display:none"></textarea>' +
        '</div>';
}

//16.03 Add / remove rows + dirty
function storyAddRow(key) {
    var sec = STORY_SECTIONS.filter(function (s) { return s.key === key; })[0];
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
    if (id === "") { storyAlert("is-err", "Вкажіть ID історії (ім'я файлу)."); return; }
    if (title === "") { storyAlert("is-err", "Вкажіть заголовок."); return; }

    var story = { id: id, title: title };
    var short = document.getElementById("st_short").value.trim();
    if (short) { story.short = short; }
    var participants = storyCollectStr("participants"); if (participants.length) { story.participants = participants; }
    var visa = storyCollectStr("visa"); if (visa.length) { story.visa = visa; }
    STORY_SECTIONS.forEach(function (sec) { var a = storyCollectSection(sec); if (a.length) { story[sec.key] = a; } });
    var custom = storyCollectCustom(); if (custom.length) { story.custom = custom; }
    var summary = storyLines("st_summary"); if (summary.length) { story.summary = summary; }

    var json = JSON.stringify(story, null, 2);
    var out = document.getElementById("storyJsonOut");
    out.style.display = ""; out.value = json;

    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json;charset=utf-8" }));
    a.download = id + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

    storyAlert("is-ok", "JSON згенеровано й завантажено.<br>" +
        "1. Покладіть файл у папку <b>DATA/stories/" + id + ".json</b>.<br>" +
        "2. Оновіть індекс історій: запустіть <b>node tools/gen_stories_index.js</b> (або кнопку «Автогенерація stories.json» на сторінці «Огляд»).<br>" +
        "3. Привʼяжіть історію до візиту у формі «Візити».");
}

function storyAlert(kind, html) {
    document.getElementById("story_alert").innerHTML = '<div class="set-alert ' + kind + '">' + html + '</div>';
}
