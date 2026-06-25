//06. Story page
function createStoryPage_HTML(storyId) {
    // Set global variable with type of map to be opened
    local = [];
    local.push(storyId, "story");

    // Set url
    if (window.skipPushState) { window.skipPushState = false; }
    else { window.history.pushState("object or string", "Title", "index.html?storyId="+storyId); }

    $.getJSON("DATA/stories/" + storyId + ".json", processMyStory);

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-" + new Date().getFullYear() + ", Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//06.02 Render the story once its JSON is loaded
var processMyStory = function (story) {
    document.getElementById("mainSection").innerHTML = HTML_StoryPage(story);

    //Keep <title>/canonical/OG in sync
    setPageMeta(story.title || "Історія", "index.html?storyId=" + local[0]);

    //Highlight the active section in the navbar
    setActiveNav("navStories");
}

//06.03 Section header + a "cell text" row helpers (keep the original markup/classes)
function storyHeader(t) {
    return "<tr><td class='story_celltext'><div class='reg_header reg_header_impr'><p class='reg_header'>" + t + "</p></div></td></tr>";
}
function storyRow(html) { return "<tr><td><div class='story_celltext'>" + html + "</div></td></tr>"; }
function storyParas(arr) { // array of paragraphs -> story_celltext paragraphs
    return "<tr><td>" + (arr || []).map(function (p) { return "<p class='story_celltext'>" + p + "</p>"; }).join("") + "</td></tr>";
}
function storyCost(price, currency) { return (price !== undefined && price !== "") ? (price + " " + (currency || "")) : ""; }

//06.04 Build the story page HTML from the JSON object
function HTML_StoryPage(story) {
    var r = "";

    //Header
    r += "<div class='h3' align='center'><b>" + (story.title || "") + "</b></div>";
    if (story.short) { r += "<div class='h5' style='text-align: center;'>" + story.short + "</div>"; }
    r += "<table class='story_table' align='center' width='100%' cellpadding='0' cellspacing='0' border='0'><tbody>";

    //Participants
    if (story.participants && story.participants.length) {
        r += storyHeader("Учасники:");
        story.participants.forEach(function (p) { r += storyRow(p); });
    }

    //Visa
    if (story.visa && story.visa.length) { r += storyHeader("Віза:") + storyParas(story.visa); }

    //Exchange rate
    if (story.exrate && story.exrate.length) {
        r += storyHeader("Курс обміну:");
        story.exrate.forEach(function (e) { r += storyRow("1 " + e.from + " = " + e.rate + " " + e.to); });
    }

    //Route
    if (story.route && story.route.length) {
        r += storyHeader("Маршрут:");
        story.route.forEach(function (d) { r += storyRow("<b>" + storyDate(d.date) + "</b> - " + d.text); });
    }

    //Habitation
    if (story.habitation && story.habitation.length) {
        r += storyHeader("Проживання:");
        story.habitation.forEach(function (h) {
            r += storyRow(h.name + " в " + h.city + ", " + h.nights + " ночі, " + h.room +
                ", ціна " + storyCost(h.price, h.currency) + " за ніч. " + (h.text || ""));
        });
    }

    //Food
    if (story.food && story.food.length) {
        r += storyHeader("Харчування:");
        story.food.forEach(function (d) { r += storyRow(d.name + " - " + storyCost(d.price, d.currency) + ". " + (d.text || "")); });
    }

    //Transport
    if (story.transport && story.transport.length) {
        r += storyHeader("Транспорт:");
        story.transport.forEach(function (t) {
            r += storyRow("<b>" + storyDate(t.date) + "</b> - " + t.type + " " + t.from + " - " + t.to +
                ", час у дорозі " + t.time + ", ціна " + storyCost(t.price, t.currency) + ". " + (t.text || "") + ".");
        });
    }

    //Sights
    if (story.sights && story.sights.length) {
        r += storyHeader("Визначні місця:");
        story.sights.forEach(function (s) {
            r += storyRow("<b>" + s.name + "</b> з локації " + s.city + ", ціна квитка = " + storyCost(s.price, s.currency) + ". " + (s.text || ""));
        });
    }

    //Souvenirs
    if (story.souvenirs && story.souvenirs.length) {
        r += storyHeader("Сувеніри:");
        story.souvenirs.forEach(function (s) {
            r += storyRow(s.name + " (" + s.num + " шт.), ціна = " + storyCost(s.price, s.currency) + ". " + (s.text || ""));
        });
    }

    //Custom narrative blocks
    if (story.custom && story.custom.length) {
        story.custom.forEach(function (c) { r += storyHeader(c.title) + storyParas(c.body); });
    }

    //Links
    if (story.links && story.links.length) {
        r += storyHeader("Посилання:");
        story.links.forEach(function (l) { r += storyRow("<a href='" + l.url + "' target='_blank'>" + l.url + "</a> - " + (l.text || "")); });
    }

    //Summary
    if (story.summary && story.summary.length) { r += storyHeader("Підсумки:") + storyParas(story.summary); }

    r += "</tbody></table>";
    r += getCountryName();
    return r;
}

//06.05 Format an ISO date (YYYY-MM-DD) as "D MonthName YYYY р."
function storyDate(iso) {
    var p = ("" + (iso || "")).split("-");
    if (p.length !== 3) { return iso || ""; }
    return parseInt(p[2], 10) + " " + getMonthName(parseInt(p[1], 10)) + " " + p[0] + " р.";
}

//06.06 Create the "back to country" links from the countries named in the story id
function getCountryName() {
    var result = "";
    var countryId = [];
    $.each (countriesVisited, function( i, country ){
        if (local[0].includes(country.short_name)){
            countryId.push(country.short_name);
        }
    });

    if (countryId.length > 1) {
        result += "<ul class='back2country'>";
        $.each (countryId, function( i, country ){
            result += "<li><a id='" + country + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + getCountryName(country) + "</a></li>"
        });
        result += "</ul>";
    }
    else {
        result = "<div><a id='" + countryId[0] + "' class='back2country' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>Назад до країни</a></div>";
    }

    return result;
}
