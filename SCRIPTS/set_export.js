//17. Settings Page - Export

//17.01 Creation of Export page
function createSettingsExportTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"export");
    local[1] = "export";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("export").setAttribute("class", "active")

    document.getElementById("rightSettingsSection").innerHTML = 'export';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}