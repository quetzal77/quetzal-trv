//14. Settings Page - Region

//14.01 Creation of main Region add, edit, removal section
function createSettingsRegionTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"region");
    local = [];
    local[1] = "region";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("regions").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ){
        listOfCountries += '<li><a id="' + country.country_id + '" onclick="javascript:showAllTheRegionsOfSelectedCountry(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Regions</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"region\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"region\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<p><b>Pencil</b> is shown for all the non mandatory fields.</p>' +
                    '<p><b>Region ID</b> should be changed only manually because it depend on map ID and region ID prefix which also must be changed.</p>' +
                    '<hr>' +
                    '<p><b>Select country</b> that region you gonna to add/edit/remove belongs to. It has to reduce list of regions shown and makes it more userfriendly.</p>' +
                    '<div id="countryDropdown" class="btn-toolbar">' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info btn-default">List of existing Countries</button>' +
                            '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                listOfCountries +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="RegionListSection"></div>' +
            '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//14.02 Second region drop down
function showAllTheRegionsOfSelectedCountry(id) {
    var listOfRegions = '';
    var country = new CountryObj(id)
    local[2] = (country.map_img != undefined) ? country.map_img : country.short_name + "Low.js" ;
    local[3] = id;
    $.each (data.area.sort(dynamicSort("name_ru")), function( i, region ){
        if (region.country_id == id && region.active != "N"){
            var regionObj = new RegionObj(region.region_id);
            listOfRegions += '<li><a id="' + region.region_id + '" onclick="javascript:addEditRemoveRegion(this.id)" onmouseover="" style="cursor: pointer;">' + region.name_ru + '</a></li>';
        }
    });

    document.getElementById("RegionListSection").innerHTML =
            '<div id="regionDropdown" class="btn-toolbar" style = "margin-left: 15px;">' +
                '<p><b>Select region</b> that you want to add/edit/remove.</p>' +
                '<div class="btn-group">' +
                    '<button type="button" class="btn btn-info btn-default btn-second-list">List of existing Regions</button>' +
                    '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                    '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a id="addnew" onclick="javascript:addEditRemoveRegion(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                        '<li role="separator" class="divider"></li>' +
                        listOfRegions +
                    '</ul>' +
                '</div>' +
            '</div>';
    document.getElementById("AddEditRemoveSection").innerHTML = "";
}

//14.03 Creation of section to be able to add new, edit or removal of region
function addEditRemoveRegion(itemId) {
    var removeButton = ""; var regIdValue = ""; var readonly = ""; var editIdField = ""; var countries = '';
    var header = "Add new"; var submitStatus = "add";var listOfNotYetAddedRegions = ""; var disabled = '';
    var country_map_url = local[2];
    var region = (itemId != "addnew") ? $.grep (data.area, function( n, i ) {return ( n.region_id == itemId )}) : "newregion";
    local[0] = {
        country_id: local[3],
        region_id: itemId,
        name: (itemId != "addnew") ? region[0].name : "",
        name_ru: (itemId != "addnew") ? region[0].name_ru : "",
        active: (itemId != "addnew") ? (region[0].active != undefined) ? region[0].active: "" : ""
    };
    var active = (local[0].active == "Y") ? "checked" : "";

    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ) {
        var selected = (country.country_id == local[3]) ? " selected" : "";
        countries += "<option value='" + country.country_id + "' " + selected + ">" + country.name_ru + "</option>";
    });

    if (itemId != "addnew"){
        regIdValue = 'value="' + local[0].region_id + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveRegion();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
    }
    else {
        disabled = 'disabled="disabled"';
        var regionOptions = "";
        var distinctIds = {};
        var countryLow = local[2].slice(0, -3);

        $.each (data.area, function( i, oldregion ) {
            if (oldregion.country_id == local[3]) {
                distinctIds[oldregion.region_id] = true;
            }
        });

        var error = false;
        $.ajax({
            async: false,
            url: "SCRIPTS/MAPS/" + local[2],
            dataType: "script",
            error: function (err) {
                    error = true;
                }
        });

        if (!error) {
            var low = eval("AmCharts.maps." + countryLow);
            $.each (low.svg.g.path, function( i, newregion ) {
                if (!distinctIds[newregion.id]) {
                    regionOptions += '<option value="' + newregion.id + '">' + newregion.title + '</option>'
                }
            });

            listOfNotYetAddedRegions =
                '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<select id="newNotAddedRegion" class="form-control" onchange="populateForm(this.value)">' +
                '<option value="0">Select region that not yet added to base among existing on country map or skip this step and add your own variant.</option>' +
                regionOptions +
                '</select>' +
                '</div>' +
                '<hr>';
        }
    }


    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' region</h2>' +
        '<form>' +
            removeButton +
            listOfNotYetAddedRegions +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique region Id" ' + regIdValue + readonly + '>' +
//                editIdField +
            '</div>' +
            '<span id="alert_id"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + local[0].name_ru + '" placeholder="Enter russian name of region">' +
            '</div>' +
            '<span id="alert_name_ru"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + local[0].name + '" placeholder="Enter english name of region">' +
            '</div>' +
            '<span id="alert_name"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<label class="checkbox-inline"><input type="checkbox"  id="newActive" value="" ' + active + '>Identifier if region can be shown for country.</label>' +
            '</div>' +
            '<span id="alert_active"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<select id="newCountry" class="form-control" ' + disabled + '>' +
                    '<option value="0">Select country that region belongs to.</option>' +
                    countries +
                '</select>' +
            '</div>' +
            '<span id="alert_country"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<button type="button" class="btn btn-default active" onclick="openCountryMap();return false">Check Region on Country Map</button>' +
            '</div>' +
            '<br>' +
        '<hr>' +
        '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
        '</form>';
}

//14.04 Remove item entity handler
function RemoveRegion() {
    var newID = document.getElementById('newId').value;
    var citiesToRemoveArray = $.grep (data.city, function( n, i ) {return (n.region_id == newID)});

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ru");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_active");
    removeAllChildNodes("alert_country");
    removeAllChildNodes("success");

    if (citiesToRemoveArray.length > 0) {
        var citiesLinkedToCountry = "";
        $.each (citiesToRemoveArray, function( i, region ){
            citiesLinkedToCountry += '<b>' + region.name_ru + '</b>, ';
        });
        document.getElementById("remove").innerHTML =
            '<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<strong>Error!</strong> This item can\'t be removed, because it\'s still dependent on some city. Change region id (or remove region) for following cities: ' +
            citiesLinkedToCountry.slice(0, -2) + '.' +
            '</div>';
    }
    else {
        $.getScript("SCRIPTS/set_content.js", function(){
            removeElementOfGlobalData4DefinedArray ("region_id", newID);
            createSettingsRegionTab_HTML();
            alertOfSuccess();
        });
    }
}

//14.05 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var newRegionObj = {
                     country_id: document.getElementById("newCountry").value.trim(),
                     region_id: document.getElementById("newId").value.trim(),
                     name: document.getElementById("newEngName").value.trim(),
                     name_ru: document.getElementById("newRusName").value.trim(),
                     active: (document.getElementById("newActive").checked) ? "Y" : "N"
                   };

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ru");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_active");
    removeAllChildNodes("alert_country");
    removeAllChildNodes("success");

    if (checkRules4AddUpdate(newRegionObj)) {
        $.getScript("SCRIPTS/set_content.js", function(){
            (status == "add") ? addElementOfGlobalDataArray(newRegionObj): updateElementOfGlobalDataArray(newRegionObj);
            createSettingsRegionTab_HTML();
            alertOfSuccess();
        });
    }
    return false;
}

//14.06 Verification for Add/Update fields
function checkRules4AddUpdate(regionObj) {
    var result = true;
    var initialRegionObj = local[0];
    for (var i = 0; i < data.area.length; i++) {
        if (initialRegionObj.region_id != "addnew") {
            //This code id deprecated because I decided that country id must be changed only manually but lets leave this code here for future needs
            if (initialRegionObj.region_id.toLowerCase() != regionObj.region_id.toLowerCase() && data.area[i].region_id.toLowerCase() == regionObj.region_id.toLowerCase()){
                alertOfDuplicateIDFailure(data.area[i].region_id, data.area[i].name_ru);
                result = false;
            }
        }
        else {
            if (data.area[i].region_id.toLowerCase() == regionObj.region_id.toLowerCase()){
                alertOfDuplicateIDFailure(data.area[i].region_id, data.area[i].name_ru);
                result = false;
            }
        }
        if (regionObj.country_id == '0'){ alertOfEmptyMandatoryField("alert_country"); result = false; }
        if (regionObj.region_id == ''){ alertOfEmptyMandatoryField("alert_id"); result = false; }
        if (regionObj.name_ru == ''){ alertOfEmptyMandatoryField("alert_name_ru"); result = false; }
        if (regionObj.name == ''){ alertOfEmptyMandatoryField("alert_name"); result = false; }
    }
    return result;
}

//14.07 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Regions to see changes added.' +
        '</div>';
}

//14.08 Failure flag for empty mandatory field
function alertOfEmptyMandatoryField(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Mandatory field is empty. Popullate it before submit.' +
        '</div>';
}

//14.09 Failure flag for not unique ID applied
function alertOfDuplicateIDFailure(id, name_ru) {
    removeAllChildNodes("success");
    document.getElementById("alert_id").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id  + ' (' + name_ru + ')</b>. Try to use another id!' +
        '</div>';
}

//14.10 Populate add new region fields
function populateForm(id) {
    document.getElementById("newId").value = id;

    var e = document.getElementById("newNotAddedRegion");
    document.getElementById("newEngName").value = e.options[e.selectedIndex].text;

    document.getElementById("newId").readOnly = true;
}

//14.11 Open Country map for region
function openCountryMap() {
    var map = local[2];
    var region = document.getElementById("newId").value;
    if (map != ""){
        window.open('/map.html?map=' + map + '&region=' + region, '_blank');
    }
    else {alertOfEmptyMandatoryField("alert_map");}
}