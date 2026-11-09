//10. Plans page (admin only): embeds plans/index.html, the index that aggregates all trip and flight plans
//10.01 Creator of page
function createPlansPage_HTML() {
    setActiveNav("navPlans");

    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?page=plans"); }
    document.title = t('plans') + " — " + window.SITE_BRAND;

    document.getElementById("mainSection").innerHTML =
        "<div class='plans-page'>" +
            "<iframe class='plans-frame' id='plansFrame' src='plans/index.html' title='" + t('plans') + "'></iframe>" +
        "</div>";
}
