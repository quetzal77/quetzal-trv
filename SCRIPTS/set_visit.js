//15. Settings Page - Visit

//15.01 Creation of main Visit add, edit, removal section
function createSettingsVisitTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"visit");
    local = [];
    local[1] = "visit";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("visits").setAttribute("class", "active")

    var listOfVisits = '';
    $.each (data.visit, function( i, visit ){
        var citiesList = "";
        $.each (visit.city, function( j, city ){
            citiesList += getRusLocationName(city) + ", ";
        });

        citiesList = (citiesList.length > 55) ? citiesList.slice(0, 55) + "..." : citiesList.slice(0, -2);

        listOfVisits += '<li><a id="' + visit.start_date + '" onclick="javascript:addEditRemoveVisits(this.id)" onmouseover="" style="cursor: pointer;">' + visit.start_date + ' - ' + citiesList + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Visits</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"visit\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"visit\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<p><b>Pencil</b> is shown for all the non mandatory fields.</p>' +
                    '<div id="countryDropdown" class="btn-toolbar">' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info btn-default">List of existing Visits</button>' +
                            '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                '<li><a id="addnew" onclick="javascript:addEditRemoveVisits(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                                '<li role="separator" class="divider"></li>' +
                                listOfVisits +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}