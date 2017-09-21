//14. Settings Page - Region

//14.01 Creation of main Region add, edit, removal section
function createSettingsRegionTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"region");
    local[1] = "region";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("regions").setAttribute("class", "active")

    var listOfRegions = '';
    $.each (data.area, function( i, area ){
        listOfRegions += '<li><a id="' + area.region_id + '" onclick="javascript:addEditRemoveRegions(this.id)" onmouseover="" style="cursor: pointer;">' + area.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML = 'region';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}