//12. Settings Page - Country

//12.01 Creation of main Country add, edit, removal section
function createSettingsCountryTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"country");
    local[1] = "country";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("countries").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country, function( i, country ){
        listOfCountries += '<li><a id="' + country.country_id + '" onclick="javascript:addEditRemoveCountries(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML = 'country';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}