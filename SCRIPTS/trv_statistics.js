//09. Statistics page
//09.01 Creator of page (placeholder — empty blocks for now)
function createStatisticsPage_HTML() {
    setActiveNav("navStats");

    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?page=statistics"); }

    document.getElementById("mainSection").innerHTML =
        "<div class='stats-page'>" +
            "<h1 class='stats-title'>Статистика</h1>" +
            "<div class='stats-grid'>" +
                "<div class='stats-card'><h3>Блок 1</h3><p class='stats-placeholder'>Тут з'явиться статистика…</p></div>" +
                "<div class='stats-card'><h3>Блок 2</h3><p class='stats-placeholder'>Тут з'явиться статистика…</p></div>" +
            "</div>" +
        "</div>";

    document.getElementById("copy_cert").innerHTML = "&copy; 2011-" + new Date().getFullYear() + ", Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}
