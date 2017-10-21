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

//    var listOfVisits = '';
//    $.each (data.visit, function( i, visit )
//        listOfVisits += '<li><a id="' + 'visit.start_date' + '" onclick="javascript:addEditRemoveVisits(this.id)" onmouseover="" style="cursor: pointer;">' + 'visit.start_date' + '</a></li>';
//    });

    document.getElementById("rightSettingsSection").innerHTML = 'visit';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}