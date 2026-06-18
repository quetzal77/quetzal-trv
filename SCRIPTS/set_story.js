//16. Settings Page - Story

//16.01 Creation of main Story add, edit, removal section
function createSettingsStoryTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"story");
    local[1] = "story";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("stories").setAttribute("class", "active")

    document.getElementById("rightSettingsSection").innerHTML = 'story';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}