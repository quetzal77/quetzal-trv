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
    var removeButton = ""; var startDateValue = ""; var endDateValue = ""; var readonly = ""; var citiesToBeSelected = "";
    var header = "Add new"; var submitStatus = "add"; var editIdField = ""; var editIdField_2 = ""; var citySelected = "";
    var firstSlice = ""; var secondSlice = "";
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
        startDateValue = 'value="' + local[0].start_date.replace(/\./g, "/") + '" ';
        endDateValue = 'value="' + local[0].end_date.replace(/\./g, "/") + '" ';
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveVisit();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        //I want to keep order of visited cities, so gather them before rest of list
        $.each (local[0].city, function( i, city ){
            firstSlice += '<option value="' + city + '" class="selected" selected>' + getEngLocationName(city) + '-' + getRusLocationName(city) + '</option>';
        });
    }
    editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" value="newPhoto" onclick="javascript:checkPhotoAlbum(this.value)">Check album</button></span>';

    // Creation list of visited cities for selector
    var distinctIds = {};
    $.each (local[0].city, function( i, city ){
        distinctIds[city] = true;
    });

    $.each (data.city, function( i, city ){
        if (!distinctIds[city.city_id]){
            secondSlice += '<option value="' + city.city_id + '">' + city.name + '-' + city.name_ru + '</option>';
        }
    });
    citiesToBeSelected += firstSlice + secondSlice;

    document.getElementById("AddEditRemoveSection").innerHTML =
            '<h2 class="sub-header">' + header + ' visit</h2>' +
            '<form>' +
                removeButton +
                '<label>Enter Start Date<span class="asteriskField">*</span> and End Date<span class="asteriskField">*</span> of visit.</label>' +
                '<div class="input-group input-daterange">' +
                '<input id="dateStart" type="text" class="form-control" name="date" ' + startDateValue + ' placeholder="DD/MM/YYY">' +
                '<div class="input-group-addon">to</div>' +
                '<input id="dateEnd" type="text" class="form-control" name="date" ' + endDateValue + ' placeholder="DD/MM/YYY">' +
                '</div>' +
                '<span id="alert_date"></span>' +
                '<br>' +
                '<label for="select3">Enter all places visited during this trip<span class="asteriskField">*</span>.</label>' +
                '<select id="select3" name="select3">' +
                    citiesToBeSelected +
                '</select>' +
                '<span id="alert_cities_list"></span>' +
                '<br>' +
                '<label for="select3">Enter url of a photo-album with photos of this trip.</label>' +
                '<div class="input-group">' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                    '<input id="newPhotos" type="text" class="form-control" value="' + photos + '" placeholder="Enter link to your photo album">' +
                    editIdField +
                '</div>' +
                '<span id="alert_photos"></span>' +
                '<br>' +
                '<label for="select3">Select story describing this travel.</label>' +
                '<div class="input-group">' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                    '<input id="newStory" type="text" class="form-control" value="' + story + '" placeholder="Select story you want to attach to visit">' +
                '</div>' +
                '<span id="alert_story"></span>' +
            '<hr>' +
            '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
            '</form>';

    // This method creates Multiple Selection Widget for adding cities visited
    runMultipleSelectWidget();
    // This method creates DatePicker Widget
    runDatePickerWidget()
}

//15.03 Remove item entity handler
function RemoveVisit() {
    debugger;
    var startDate = document.getElementById('dateStart').value;
    startDate = startDate.replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, ".");

    removeAllChildNodes("alert_date");
    removeAllChildNodes("alert_cities_list");
    removeAllChildNodes("success");

    $.getScript("SCRIPTS/set_content.js", function(){
        removeElementOfGlobalData4DefinedArray ("start_date", startDate);
        createSettingsVisitTab_HTML();
        alertOfSuccess();
    });
}

//15.04 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var newVisitObj = {
                     start_date: $('#dateStart').val().replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "."),
                     end_date: $('#dateEnd').val().replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, ".")
                   };

    if ($('#select3').val() != "") { newVisitObj["city"] = $('#select3').val(); }
    if (document.getElementById("newPhotos").value.trim() != "") { newVisitObj["photos"] = document.getElementById("newPhotos").value.trim(); }
    if (document.getElementById("newStory").value.trim() != "") { newVisitObj["story"] = document.getElementById("newStory").value.trim(); }

    removeAllChildNodes("alert_date");
    removeAllChildNodes("alert_cities_list");
    removeAllChildNodes("success");

    if (checkRules4AddUpdate(newVisitObj)) {
        $.getScript("SCRIPTS/set_content.js", function(){
            (status == "add") ? addElementOfGlobalDataArray(newVisitObj): updateElementOfGlobalDataArray(newVisitObj);
            createSettingsVisitTab_HTML();
            alertOfSuccess();
        });
    }
    return false;
}

//15.05 Verification for Add/Update fields
function checkRules4AddUpdate(visitObj) {
    var result = true;
    var initialVisitObj = local[0];

    for (var i = 0; i < data.visit.length; i++) {
        if (initialVisitObj.start_date != "addnew") {
            if (initialVisitObj.start_date != visitObj.start_date && data.visit[i].start_date == visitObj.start_date){
                alertOfDuplicateStartDateFailure(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
            if (initialVisitObj.end_date != visitObj.end_date && data.visit[i].end_date == visitObj.end_date){
                alertOfDuplicateEndDAteFailure(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
        }
        else {
            if (data.visit[i].start_date == visitObj.start_date){
                alertOfDuplicateStartDateFailure(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
            if (data.visit[i].end_date == visitObj.end_date){
                alertOfDuplicateEndDAteFailure(data.visit[i].start_date, data.visit[i].end_date);
                result = false;
            }
        }
        if (visitObj.start_date == ''){ alertOfEmptyMandatoryField("alert_date"); result = false; }
        if (visitObj.end_date == ''){ alertOfEmptyMandatoryField("alert_date"); result = false; }
        if (visitObj.city == undefined){ alertOfEmptyMandatoryField("alert_cities_list"); result = false; }
    }
    return result;
}

//15.06 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Visits to see changes.' +
        '</div>';
}

//15.07 Failure flag for not unique ID applied
function alertOfDuplicateStartDateFailure(start_date, end_date) {
    removeAllChildNodes("success");
    document.getElementById("alert_date").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Start date is not unique, it\'s one already accociated with next visit <b>' + start_date + ' - ' + end_date  + '</b>. Try to use another START date!' +
        '</div>';
}

//15.08 Failure flag for not unique ID applied
function alertOfDuplicateEndDAteFailure(start_date, end_date) {
    removeAllChildNodes("success");
    document.getElementById("alert_date").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> End date is not unique, it\'s one already accociated with next visit <b>' + start_date + ' - ' + end_date  + '</b>. Try to use another END date   !' +
        '</div>';
}

//15.09 Failure flag for empty mandatory field
function alertOfEmptyMandatoryField(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Mandatory field is empty. Popullate it before submit.' +
        '</div>';
}

//15.10 Run multiselect Widget
function runMultipleSelectWidget() {
    $("#select3").fcbkcomplete({
        width:'100%', // - element width (by default 512px)
//        json_url: "data.txt",
//        addontab: true,
//        maxitems: 10,
//        input_min_size: 0,
        height: 10, // - maximum number of element shown before scroll will apear
        cache: true, // - use cache
        newel: false, // - show typed text like a element
        filter_case: false, //- case sensitive filter
        filter_selected: false, // - filter selected items from list (remove selected items from selection)
//        select_all_text: "select", // - text for select all link
    });
}

//15.11 Run DatePicker Widget
function runDatePickerWidget() {
    var date_input=$('input[name="date"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
        clearBtn: true
    };
    date_input.datepicker(options);
}

//15.12 Open photo album for visit
function checkPhotoAlbum() {
    var map = document.getElementById("newPhotos").value.trim();
    if (map != ""){
        window.open(map, '_blank');
    }
    else {alertOfEmptyMandatoryField("alert_photos");}
}