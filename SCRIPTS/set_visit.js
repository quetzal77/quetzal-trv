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

//15.02 Creation of section to be able to add new, edit or removal of visit
function addEditRemoveVisits(itemId) {
    var removeButton = ""; var startDateValue = ""; var endDateValue = ""; var readonly = "";
    var header = "Add new"; var submitStatus = "add"; var editIdField = ""; var editIdField_2 = "";
    var visit = (itemId != "addnew") ? $.grep (data.visit, function( n, i ) {return ( n.start_date == itemId )}) : "newvisit";
    local[0] = {
            start_date: itemId,
            end_date: (itemId != "addnew") ? visit[0].end_date : "",
            city: (itemId != "addnew") ? visit[0].city : ""
        };

    if (itemId != "addnew" && visit[0].photos != undefined) { local[0].photos = visit[0].photos; }
        var photos = (local[0].photos != undefined) ? local[0].photos : "";
    if (itemId != "addnew" && visit[0].story != undefined) { local[0].story = visit[0].story; }
        var story = (local[0].story != undefined) ? local[0].story : "";

    if (itemId != "addnew"){
        startDateValue = 'value="' + local[0].start_date + '" ';
        endDateValue = 'value="' + local[0].end_date + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveVisit();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
        editIdField_2 = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newShortName" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
            '<h2 class="sub-header">' + header + ' visit</h2>' +
            '<form>' +
                removeButton +
                '<div class="input-group">' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                    '<input id="newStartDate" type="text" class="form-control" placeholder="Enter start date of visit <dd.mm.yyyy>" ' + startDateValue + readonly + '>' +
                        editIdField +
                '</div>' +
                '<span id="alert_start_date"></span>' +
                '<br>' +
                '<div class="input-group">' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                    '<input id="newEndDate" type="text" class="form-control" placeholder="Enter end date of visit <dd.mm.yyyy>" ' + endDateValue + readonly + '>' +
                        editIdField_2 +
                '</div>' +
                '<span id="alert_end_date"></span>' +
                '<br>' +
                '<div class="form-group">' +
                    '<textarea id="newCitiesList" class="form-control" rows="5" placeholder="Enter list of visited cities separated by comma">' + local[0].city + '</textarea>' +
                '</div>' +
                '<span id="alert_cities_list"></span>' +
                '<div class="input-group">' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                    '<input id="newPhotos" type="text" class="form-control" value="' + photos + '" placeholder="Enter link to your photo album">' +
                '</div>' +
                '<span id="alert_photos"></span>' +
                '<br>' +
                '<div class="input-group">' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                    '<input id="newStory" type="text" class="form-control" value="' + story + '" placeholder="Select story you want to attach to visit">' +
                '</div>' +
                '<span id="alert_story"></span>' +
            '<hr>' +
            '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
            '</form>';
}