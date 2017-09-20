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

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
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
                '<li id="types"><a onclick="javascript:createSettingsTypeTab()" onmouseover="" style="cursor: pointer;">Entity types</a></li>' +
                '<li id="continents"><a onclick="javascript:createSettingsContinentTab()" onmouseover="" style="cursor: pointer;">Continents</a></li>' +
                '<li id="countries"><a href="">Countries</a></li>' +
                '<li id="regions"><a href="">Regions</a></li>' +
                '<li id="cities"><a onclick="javascript:createSettingsCityTab()" onmouseover="" style="cursor: pointer;">Cities</a></li>' +
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
    data.country.sort(dynamicSort("name"));

    $.each(data.country, function( i, country ){
        var countryObj = $.grep (countriesVisited, function( n, i ){
            return (n.country_id == country.country_id)
        });
        var numberCountryVisites = 0;
        if (countryObj[0] != undefined) {
            $.each(visitsSorted, function( i, visit ){
                var ifVisited = false;
                $.each(visit.cities, function( i, city ){
                    if (city.country_id == countryObj[0].short_name) {ifVisited = true;}
                });
                if (ifVisited) {numberCountryVisites = numberCountryVisites + 1;}
            });
        }

        var countryToVisit = (countryObj[0] != undefined) ? "<a id='" + country.short_name + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + country.name + "</a>"
                                                          : country.name + " <span class='glyphicon glyphicon-remove'></span>" ;
        var regionsVisitedNum = (countryObj[0] != undefined) ? countryObj[0].getNumberOfVisitedRegions() : 0 ;
        var citiesVisitedNum = (countryObj[0] != undefined) ? countryObj[0].getNumberOfVisitedCities() : 0 ;

        table +=
        '<tr>' +
            '<td id="thalign">' + num + '</td>' +
            '<td id="thalign">' + countryToVisit + '</td>' +
            '<td id="thalign">' + regionsVisitedNum + '</td>' +
            '<td id="thalign">' + citiesVisitedNum + '</td>' +
            '<td id="thalign">' + numberCountryVisites + '</td>' +
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