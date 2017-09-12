//11. Settings Page - Location Types

//11.01 Creation of main Continents add, edit, removal section
function createSettingsCityTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"city");

    local[1] = "city";

    removeAllAttributesByName("class", "active");
    document.getElementById("cities").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ){
        listOfCountries += '<li><a id="' + country.short_name + '" onclick="javascript:showAllTheCitiesOfSelectedCountry(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Cities</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"city\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"city\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<hr>' +
                    '<p><b>Select country</b> that city you gonna to add/edit/remove belongs to. It has to reduce list of cities shown and makes it more userfriendly.</p>' +
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
            '<div id="CityListSection"></div>' +
            '<div id="AddEditRemoveSection"></div>';
}

//11.01 Creation of main Continents add, edit, removal section
function showAllTheCitiesOfSelectedCountry(id) {
    var listOfCities = '';
    $.each (data.city.sort(dynamicSort("name_ru")), function( i, city ){
        var cityObj = new CityObj(city.city_id);
        var cityName = (city.type) ? getCityNameUpdatedRu(city.name_ru, city.type) : city.name_ru;
        if (cityObj.getCountryId() == id){
            listOfCities += '<li><a id="' + city.city_id + '" onclick="javascript:addEditRemoveLocationTypes(this.id)" onmouseover="" style="cursor: pointer;">' + cityName + '</a></li>';
        }
    });

    document.getElementById("CityListSection").innerHTML =
            '<div id="cityDropdown" class="btn-toolbar" style = "margin-left: 15px;">' +
                '<p><b>Select city</b> that you want to add/edit/remove.</p>' +
                '<div class="btn-group">' +
                    '<button type="button" class="btn btn-info btn-default btn-second-list">List of existing Cities</button>' +
                    '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                    '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a id="addnew" onclick="javascript:addEditRemoveCity(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                        '<li role="separator" class="divider"></li>' +
                        listOfCities +
                    '</ul>' +
                '</div>' +
            '</div>';
}