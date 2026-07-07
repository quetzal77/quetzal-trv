//00.00 On Load fucntions
//This page is first one loaded, and depend on its logic we dynamically build appropriate pages

//00.01 ARRAY USED FOR CREATION OF WORLD PAGE
    var initial_data;  // Store initial information for creation of home page
    var local; // Store variable that describe which country have to be opened and drawn on a map
    window.skipPushState = true; // when true, the next page creator re-renders WITHOUT pushing history (initial load + Back/Forward)
    window.LANG = localStorage.getItem('lang') || 'uk';
    window.APP_V = '9.4.0';
    window.entityName = function(entity) {
        if (!entity) { return ''; }
        return (window.LANG === 'en') ? (entity.name || entity.name_ua || '') : (entity.name_ua || entity.name || '');
    };
    window.t = function(key) { var v = (i18n[window.LANG] || i18n.uk)[key]; return v !== undefined ? v : key; };
    window.toggleLang = function() {
        localStorage.setItem('lang', window.LANG === 'uk' ? 'en' : 'uk');
        location.reload();
    };

//00.01b PAGE METADATA — keep <title>, canonical link and OG/Twitter tags in sync with the current page
    window.SITE_URL = "https://quetzal.epizy.com/";
    window.SITE_BRAND = t('brandName');
    // label = short page label ("" / undefined for home); path = URL after the base (e.g. "index.html?country=ES")
    window.setPageMeta = function (label, path) {
        try {
            var title = label ? (label + " — " + window.SITE_BRAND) : window.SITE_BRAND;
            document.title = title;
            var url = window.SITE_URL + (path || "");
            var set = function (sel, attr, val) { var el = document.head.querySelector(sel); if (el) { el.setAttribute(attr, val); } };
            set("link[rel='canonical']", "href", url);
            set("meta[property='og:title']", "content", title);
            set("meta[property='og:url']", "content", url);
            set("meta[name='twitter:title']", "content", title);
        } catch (e) {}
    };

//00.02 Run function on load of World page (Home page)
//This is jQuery function that takes data from json and transform them to collection that could be basis for creation of world page
    window.onload = function() {
        $.getJSON("DATA/onload.json")
            .done(processMyJson)
            .fail(function() {
                var el = document.getElementById("mainSection");
                if (el) { el.innerHTML = '<div class="set-alert is-err">Failed to load DATA/onload.json. Check the server and reload the page.</div>'; }
            });
    };
    // Preload story index so the navbar dropdown can show language badges
    $.getJSON("DATA/stories.json", function(idx) { window.__storiesIndex = idx || []; })
        .fail(function() { window.__storiesIndex = []; });
    applyNavFooterTranslations();
// When the user scrolls down from the top of the document, show the button
    window.onscroll = function() {updateBackToTopVisibility()};
// Browser Back/Forward: re-render the page for the current URL without pushing a new entry
    window.onpopstate = function() {
        var params = new URLSearchParams(window.location.search);
        window.skipPushState = true;
        if (params.get("country"))      { getCountryPage(params.get("country")); }
        else if (params.get("cityId"))  { getCityPage(params.get("cityId")); }
        else if (params.get("storyId")) { getStoryPage(params.get("storyId")); }
        else if (params.get("page") === "about")    { HTML_CreatorOfAboutPage(); }
        else if (params.get("page") === "statistics") { getStatisticsPage(); }
        else if (params.get("page") === "settings") { getSettingsOverviewPage(); }
        else { createWorldPage_HTML(); getNumberOfLocation(); }
    };
// Close the navbar search dropdown when clicking outside of it
    document.addEventListener("click", function(e){
        var search = document.getElementById("navSearch");
        var box = document.getElementById("navSearchResults");
        if (box && search && e.target !== search && !box.contains(e.target)) {
            box.classList.remove("show");
        }
    });

//00.03 This method creates initial collection we need to populate world page
//Also it contains logic of loading
    var processMyJson = function (result){
        initial_data = result;
        //Add all the services used among all the classes
        $.getScript("SCRIPTS/bcd_services.js?v=" + APP_V, function(){ getWorldPage(headerMenu); })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load bcd_services.js. Reload the page.</div>'; });
    }

    function applyNavFooterTranslations() {
        var q = function(sel) { return document.querySelector(sel); };
        var el;
        // Navbar links
        el = q('#navHome a');        if (el) { el.textContent = t('home'); }
        el = q('#navStats a');       if (el) { el.textContent = t('statistics'); }
        el = q('#navStories > a');   if (el) { el.innerHTML = t('stories') + ' <span class="caret"></span>'; }
        el = q('.navbar-brand .brand-text'); if (el) { el.textContent = t('brandName'); }
        el = document.getElementById('navSearch'); if (el) { el.placeholder = t('searchPlaceholder'); }
        el = q('#navSettings a');    if (el) { el.setAttribute('title', t('settings')); el.setAttribute('aria-label', t('settings')); }
        // Footer links
        var footerKeys = ['home', 'statistics', 'settings', 'about'];
        var links = document.querySelectorAll('.footer-links a');
        for (var i = 0; i < links.length; i++) { if (footerKeys[i]) { links[i].textContent = t(footerKeys[i]); } }
        // Back to top
        el = document.getElementById('back'); if (el) { el.textContent = t('backToTop'); }
        // Lang toggle label
        el = document.getElementById('langToggle'); if (el) { el.textContent = window.LANG === 'en' ? 'EN' : 'UA'; }
    }

    var headerMenu = function populateHeaderMenu(){
        document.getElementById("ContentBody_StoryList").innerHTML = getSelectorOfListOfStories_HTML();
        applyNavFooterTranslations();
    }

    function getWorldPage( callback ){
        //Create world page
        $.getScript("SCRIPTS/trv_world.js?v=" + APP_V, function(){
            createWorldPage_HTML();
            $.getScript("SCRIPTS/bcd-content.js?v=" + APP_V, function(){ populateContent(callback); })
                .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load bcd-content.js. Reload the page.</div>'; });
        }).fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load trv_world.js. Reload the page.</div>'; });
    }

    function getCountryPage( country_id ){
        //Create country page
        $.getScript("SCRIPTS/trv_country.js?v=" + APP_V, function(){ createCountryPage_HTML(country_id) })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function getCityPage( city_id ){
        //Create country page
        $.getScript("SCRIPTS/trv_city.js?v=" + APP_V, function(){ createCityPage_HTML(city_id) })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function getStoryPage( story_id ){
        //Create story page
        $.getScript("SCRIPTS/trv_story.js?v=" + APP_V, function(){ createStoryPage_HTML(story_id) })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function getStatisticsPage(){
        //Create statistics page
        $.getScript("SCRIPTS/trv_statistics.js?v=" + APP_V, function(){ createStatisticsPage_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function getSettingsOverviewPage( setting_type ){
        //Create settings-overview page
        $.getScript("SCRIPTS/set_overview.js?v=" + APP_V, function(){ createSettingsPage_HTML(setting_type) })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsContinentTab(){
        //Create settings-continent tab
        $.getScript("SCRIPTS/set_continent.js?v=" + APP_V, function(){ createSettingsContinentTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsCountryTypeTab(){
        //Create settings-country_type tab
        $.getScript("SCRIPTS/set_country_type.js?v=" + APP_V, function(){ createSettingsCountryTypeTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsTypeTab(){
        //Create settings-location_type tab
        $.getScript("SCRIPTS/set_type.js?v=" + APP_V, function(){ createSettingsTypeTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsCityTab(){
        //Create settings-city tab
        $.getScript("SCRIPTS/set_city.js?v=" + APP_V, function(){ createSettingsCityTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsCountryTab(){
        //Create settings-country tab
        $.getScript("SCRIPTS/set_country.js?v=" + APP_V, function(){ createSettingsCountryTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsRegionTab(){
        //Create settings-region tab
        $.getScript("SCRIPTS/set_region.js?v=" + APP_V, function(){ createSettingsRegionTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsVisitTab(){
        //Create settings-visit tab
        $.getScript("SCRIPTS/set_visit.js?v=" + APP_V, function(){ createSettingsVisitTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

    function createSettingsStoryTab(){
        //Create settings-story tab
        $.getScript("SCRIPTS/set_story.js?v=" + APP_V, function(){ createSettingsStoryTab_HTML() })
            .fail(function() { document.getElementById("mainSection").innerHTML = '<div class="set-alert is-err">Failed to load page script. Reload and try again.</div>'; });
    }

