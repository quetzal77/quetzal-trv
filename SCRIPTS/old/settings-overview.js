//11. Settings Page
//11.01 Creator of main page
function HTML_CreatorOfSettingsPage() {
    //Add Settings main content
    document.getElementById("settingsPage").innerHTML =
        '<div class="row">' +
            HTML_Settings_LeftPanel() +
            '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" id="rightSettingsSection">' +
            '</div>' +
        '</div>';

    HTML_Settings_OverviewTab();
}

//11.02 Creator of left menu
function HTML_Settings_LeftPanel() {
    var result =
            '<div class="col-sm-3 col-md-2 sidebar">' +
                '<ul class="nav nav-sidebar">' +
                    '<li class="active" id="overview"><a onclick="javascript:HTML_Settings_OverviewTab()" onmouseover="" style="cursor: pointer;">Overview</a></li>' +
                    '<li id="export"><a href="#">Export</a></li>' +
                '</ul>' +
                '<ul class="nav nav-sidebar">' +
                    '<li id="entites"><a href="">Level</a></li>' +
                    '<li id="continents"><a onclick="javascript:HTML_Settings_ContinentsTab()" onmouseover="" style="cursor: pointer;">Continents</a></li>' +
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

//11.03 Creator of overview section
function HTML_Settings_OverviewTab() {
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
var visitesNum = 0;

ArrayOfVisitedCountries.sort(dynamicSort("nameEn"));

for (var i = 0; i < ArrayOfVisitedCountries.length; i++) {
	for (var j = 0; j < ArrayOfVisitsSorted.length; j++) {
		if (ArrayOfVisitedCountries[i].id == ArrayOfVisitsSorted[j].id){
			visitesNum = visitesNum + 1;
		}
	}

	table +=       
	'<tr>' +
		'<td id="thalign">' + num + '</td>' +
		'<td id="thalign">' + ArrayOfVisitedCountries[i].nameEn + '</td>' +
		'<td id="thalign">' + ArrayOfVisitedCountries[i].visitedRegionsList.length + '</td>' +
		'<td id="thalign">' + ArrayOfVisitedCountries[i].visitedCitiesList.length + '</td>' +
		'<td id="thalign">' + visitesNum + '</td>' +
	'</tr>';
	num = num + 1;
	visitesNum = 0;
}

var result = 
        '<h2 class="sub-header">Visites per country</h2>' +
        '<div class="table-responsive">' +
            '<table class="table table-striped">' +
                '<thead>' +
                    '<tr>' +
                        '<th>#</th>' +
                        '<th>Country name</th>' +
                        '<th>Regions number</th>' +
                        '<th>Cities number</th>' +
                        '<th>Visits number</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
					table +
                '</tbody>' +
            '</table>' +
        '</div>';

return result
}