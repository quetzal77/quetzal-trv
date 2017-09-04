//08. Settings Page
//08.01 Creator of main page
function createSettingsPage_HTML(setting_type) {
    // Set global variable with type of map to be opened
    local = [];
    local.push("settings", setting_type);

    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+setting_type);

    //Add Settings main content
    document.getElementById("mainSection").innerHTML =
        '<div class="container-fluid" id="settingsPage">' +
            '<div class="row">' +
                HTML_Settings_LeftPanel() +
                '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" id="rightSettingsSection">' +
                '</div>' +
            '</div>' +
        '</div> <!-- /container -->';

    createSettingsOverviewTab_HTML();
}

//08.02 Creator of left menu
function HTML_Settings_LeftPanel() {
    var result =
        '<div class="col-sm-3 col-md-2 sidebar">' +
            '<ul class="nav nav-sidebar">' +
                '<li class="active" id="overview"><a onclick="javascript:createSettingsOverviewTab_HTML()" onmouseover="" style="cursor: pointer;">Overview</a></li>' +
                '<li id="export"><a href="#">Export</a></li>' +
            '</ul>' +
            '<ul class="nav nav-sidebar">' +
                '<li id="entites"><a href="">Levels</a></li>' +
                '<li id="continents"><a onclick="javascript:createSettingsContinentTab()" onmouseover="" style="cursor: pointer;">Continents</a></li>' +
                '<li id="countries"><a href="">Countries</a></li>' +
                '<li id="regions"><a href="">Regions</a></li>' +
                '<li id="cities"><a href="">Cities</a></li>' +
            '</ul>' +
            '<ul class="nav nav-sidebar">' +
                '<li id="visits"><a href="">Visits</a></li>' +
                '<li id="stories"><a href="">Stories</a></li>' +
            '</ul>' +
        '</div>';

    return result;
}

//08.03 Creator of overview section
function createSettingsOverviewTab_HTML() {
    removeAllAttributesByName("class", "active");
    document.getElementById("overview").setAttribute("class", "active")

    document.getElementById("rightSettingsSection").innerHTML =
        '<h1 class="page-header">Overview</h1>' +
        '<div class="row placeholders">' +
            '<div class="col-xs-6 col-sm-3 placeholder">' +
                '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">' +
                '<h4>Continents</h4>' +
                '<span class="text-muted">&nbsp;</span>' +
            '</div>' +
            '<div class="col-xs-6 col-sm-3 placeholder">' +
                '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">' +
                '<h4>Countries</h4>' +
                '<span class="text-muted">&nbsp;</span>' +
            '</div>' +
            '<div class="col-xs-6 col-sm-3 placeholder">' +
                '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">' +
                '<h4>Label</h4>' +
                '<span class="text-muted">&nbsp;</span>' +
            '</div>' +
            '<div class="col-xs-6 col-sm-3 placeholder">' +
                '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">' +
                '<h4>Label</h4>' +
                '<span class="text-muted">&nbsp;</span>' +
            '</div>' +
			HTML_VisitesPerCountryTale() +
        '</div>';
}

function HTML_VisitesPerCountryTale() {
    var num = 1;
    var table = "";
    countriesVisited.sort(dynamicSort("name"));

    $.each(countriesVisited, function( i, country ){
        table +=
        '<tr>' +
            '<td id="thalign">' + num + '</td>' +
            '<td id="thalign">' + country.name + '</td>' +
            '<td id="thalign">' + country.getNumberOfVisitedRegions() + '</td>' +
            '<td id="thalign">' + country.getNumberOfVisitedCities() + '</td>' +
            '<td id="thalign">' + country.getNumberOfVisits() + '</td>' +
        '</tr>';
        num = num + 1;
    });

    return  '<h2 class="sub-header" style="text-align:left">Visites per country</h2>' +
            '<div class="table-responsive">' +
                '<table class="table table-striped">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>#</th>' +
                            '<th>Country name</th>' +
                            '<th>Regions Visited number</th>' +
                            '<th>Cities Visited number</th>' +
                            '<th>Visits number</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        table +
                    '</tbody>' +
                '</table>' +
            '</div>';
}