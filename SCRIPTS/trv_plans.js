//10. Plans page (admin only): embeds plans/index.html, the index that aggregates all trip and flight plans
//10.01 Creator of page
function createPlansPage_HTML() {
    setActiveNav("navPlans");

    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?page=plans"); }
    document.title = t('plans') + " — " + window.SITE_BRAND;

    document.getElementById("mainSection").innerHTML =
        "<div class='plans-page'>" +
            "<iframe class='plans-frame' id='plansFrame' src='plans/index.html' title='" + t('plans') + "' scrolling='no'></iframe>" +
        "</div>";

    var frame = document.getElementById("plansFrame");
    var fit = function () {
        if (!document.body.contains(frame)) { clearInterval(timer); return; }
        try {
            var d = frame.contentDocument;
            if (!d || !d.documentElement) { return; }
            var h = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
            if (h > 0 && Math.abs(frame.offsetHeight - h) > 1) { frame.style.height = h + "px"; }
        } catch (e) {}
    };
    var timer = setInterval(fit, 400);
    frame.onload = fit;
}
