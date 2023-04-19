//06. Story page
function createStoryPage_HTML(storyId) {
    // Set global variable with type of map to be opened
    local = [];
    local.push(storyId, "story");

    // Set url
    window.history.pushState("object or string", "Title", "index.html?storyId="+storyId);

    var storyFileUrl = "DATA/stories/" + storyId + ".xml";
    $.get(storyFileUrl, processMyStory, 'xml');

    //Add copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "&copy; 2011-2023, Slavutskyy Oleksiy";
    document.getElementById("hr_bottom").innerHTML = "<hr>";
}

//06.02 This method creates all collections we need to populate story page
var processMyStory = function (data) {
    xmlDoc = data;
    //List of objects represents articles of story
    title = processStoryCollection(xmlDoc.getElementsByTagName('name'));
    participants = processStoryCollection(xmlDoc.getElementsByTagName('participants'));
    links = processStoryCollection(xmlDoc.getElementsByTagName('links'));
    custom = processStoryCollection(xmlDoc.getElementsByTagName('custom'));
    route = processStoryCollection(xmlDoc.getElementsByTagName('route'));
    summary = processStoryCollection(xmlDoc.getElementsByTagName('summary'));
    visa = processStoryCollection(xmlDoc.getElementsByTagName('visa'));
    exrate = processStoryCollection(xmlDoc.getElementsByTagName('exrate'));
    habitation = processStoryCollection(xmlDoc.getElementsByTagName('habitation'));
    transport = processStoryCollection(xmlDoc.getElementsByTagName('transport'));
    sights = processStoryCollection(xmlDoc.getElementsByTagName('sights'));
    souvenirs = processStoryCollection(xmlDoc.getElementsByTagName('souvenirs'));
    food = processStoryCollection(xmlDoc.getElementsByTagName('food'));

    //Create selector of countries
    document.getElementById("mainSection").innerHTML = HTML_StoryPage();
}

//06.03 This method transform HTMLCollection to collection (node)
    var processStoryCollection = function (collection) {
        var result = [];
        var obj;
        for (var i = 0; i < collection.length; i++) {
            obj = ObjToHash2(collection[i]);
            result.push(obj);
        }
        return result;
    }

//06.04 This method pars xml tag to type that can be saved as collection
    var ObjToHash2 = function (obj) {
        //console.log('ObjToHash');
        var result = { 'title': '' };
        var child;
        for (var i = 0; i < obj.childNodes.length; i++) {
            child = obj.childNodes[i];
            if (child.nodeType == 3 && child.nodeValue.trim() != '') {
                result['title'] = child.nodeValue.trim();
            } else if (child.nodeType == 1) {
                result[child.tagName + '_' + i] = child.firstChild && child.firstChild.data || '';
                if (child.attributes.length != 0) {
                    for (var j = 0; j < child.attributes.length; j++) {
                        result[child.attributes[j].name + '_' + i] = parseFloat(child.attributes[j].value) || child.attributes[j].value;
                    }
                }
            }
        }
        return result;
    }

//06.04 This method create html page for story page
function HTML_StoryPage() {
    var result = "";

    //06.04.01 Header section
    result += "<div class='h3' align='center'><b>" + title[0].title + "</b></div>";
    if (title[0].short_1 != undefined) {
        result += "<div class='h5' style='text-align: center;'>" + title[0].short_1 + "</div>";
    }
    result += "<table align='center' width='100%' cellpadding='7' cellspacing='0' border='0'><tbody>";

    //06.04.02 Participants section
    if (participants[0] != undefined) {
        var participantsKeys = Object.keys(participants[0]);
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Список участников:</p></div></td></tr>";

        for (i = 0; i < participantsKeys.length; i++) {
            if (participantsKeys[i] != 'title') {
                var keyOfName = participantsKeys[i];
                result += "<tr><td><div class='story_celltext'>" + participants[0][keyOfName] + "</div></td></tr>";
            }
         }
    }

    //06.04.03 Visa section
    if (visa[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Виза:</p></div></td></tr>"+
                  "<tr><td>" + visa[0].title + "</td></tr>";
    }

    //06.04.04 Exchange rate section
    if (exrate[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Обменный курс:</p></div></td></tr>";
        var exrateArray = arrayToArray(exrate[0]);

        for (i = 0; i < exrateArray.length; i++) {
            result += "<tr><td><div class='story_celltext'> 1 " + exrateArray[i].cur1 + " = " + exrateArray[i].rate + " " + exrateArray[i].curnt + " </div></td></tr>";
        }
    }

    //06.04.05 Rout section
    if (route[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Маршрут:</p></div></td></tr>";
        var routArray = arrayToArray(route[0]);

        for (i = 0; i < routArray.length; i++) {
            result += "<tr><td><div class='story_celltext'><b>" + routDateCalculator(routArray[i].date) + "</b> - " + routArray[i].day + "</div></td></tr>";
        }
    }

    //06.04.06 Habitation section
    if (habitation[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Проживание:</p></div></td></tr>";
        var habitationArray = arrayToArray(habitation[0]);

        for (i = 0; i < habitationArray.length; i++) {
            result += "<tr><td><div class='story_celltext'>" + habitationArray[i].name + " в " + habitationArray[i].city +
            ", " + habitationArray[i].nights + " ночь(и), " + habitationArray[i].room + ", цена " + habitationArray[i].price + " " + habitationArray[i].currency + " за ночь. " +
            habitationArray[i].place + "</div></td></tr>";
        }
    }

    //06.04.07 Food section
    if (food[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Питание:</p></div></td></tr>";
        var foodArray = arrayToArray(food[0]);

        for (i = 0; i < foodArray.length; i++) {
            result += "<tr><td><div class='story_celltext'>" + foodArray[i].name +
                      " - " + foodArray[i].price + " " + foodArray[i].currency + ". </div></td></tr>";
        }
    }

    //06.04.08 Transport section
    if (transport[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Транспорт:</p></div></td></tr>";
        var transportArray = arrayToArray(transport[0]);

        for (i = 0; i < transportArray.length; i++) {
            result += "<tr><td><div class='story_celltext'><b>" + routDateCalculator(transportArray[i].date) + "</b> - " + transportArray[i].type +
                      " " + transportArray[i].dep + " - " + transportArray[i].arr + ", время в пути " + transportArray[i].time +
                      ", цена " + transportArray[i].price + " " + transportArray[i].currency + ". " + transportArray[i].day + ".</div></td></tr>";
        }
    }

    //06.04.09 Sights section
    if (sights[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Достопримечательности:</p></div></td></tr>";
        var sightsArray = arrayToArray(sights[0]);

        for (i = 0; i < sightsArray.length; i++) {
            result += "<tr><td><div class='story_celltext'><b>" + sightsArray[i].name + "</b> из локации " + sightsArray[i].city +
                      ", цена билета = " + sightsArray[i].price + " " + sightsArray[i].currency +
                      ". " + sightsArray[i].sight + "</div></td></tr>";
        }
    }

    //06.04.09 Souvenirs section
    if (souvenirs[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Сувениры:</p></div></td></tr>";
        var souvenirsArray = arrayToArray(souvenirs[0]);

        for (i = 0; i < souvenirsArray.length; i++) {
            result += "<tr><td><div class='story_celltext'>" + souvenirsArray[i].name + " (" + souvenirsArray[i].num +
                      " шт.), цена = " + souvenirsArray[i].price + " " + souvenirsArray[i].currency + ". " + souvenirsArray[i].souvenir + "</div></td></tr>";
        }
    }

    //06.04.10 Custom section
    if (custom[0] != undefined) {
        var customArray = arrayToArray(custom[0]);

        for (i = 0; i < customArray.length; i++) {
            result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>" + customArray[i].name + "</p></div></td></tr>";
            result += "<tr><td><div class='story_celltext'>" + customArray[i].item + "</div></td></tr>";
        }
    }

    //06.04.11 Links section
    if (links[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Ссылки:</p></div></td></tr>";
        var urlArray = arrayToArray(links[0]);

        for (i = 0; i < urlArray.length; i++) {
            result += "<tr><td><div class='story_celltext'><a href='" + urlArray[i].src + "' target='_blank'>" +
            urlArray[i].src + "</a> - " + urlArray[i].link + "</div></td></tr>";
        }
    }

    //06.04.12 Summary section
    if (summary[0] != undefined) {
        result += "<tr><td class='story_celltext'><div class='well reg_header reg_header_impr'><p class='reg_header'>Итоги:</p></div></td></tr>" +
        "<tr><td>" + summary[0].title + "</td></tr>";
    }

    result += "</tbody></table>";

   //06.04.final Return to country button
    result += getCountryName();
    return result
}

//06.05 This method calculate and returns rout date
function routDateCalculator(date) {
    var result = "";
    var day, month, year;

    if (date.toString().length == 7) {
        day = date.toString().substring(0, 1);
        month = getRusMonthName ((date.toString().substring(1, 2) == 0) ? date.toString().substring(2, 3) : date.toString().substring(1, 3));
        year = date.toString().substring(3, 7);
    }
    else {
        day = date.toString().substring(0, 2);
        month = getRusMonthName((date.toString().substring(2, 3) == 0) ? date.toString().substring(3, 4) : date.toString().substring(2, 4));
        year = date.toString().substring(4, 8);
    }


    result += day + " " + month + " " + year + " г.";
    return result
}

//06.06 This method take initial array and then return array where attributes are linked each other
function arrayToArray(array) {
    var arrayKeys = Object.keys(array);
    var KeysArray = [];

    for (i = 0; i < arrayKeys.length; i++) {
        if (arrayKeys[i] != 'title') {
            var someArray = arrayKeys[i].split("_");
            KeysArray.push(someArray[0]);
         }
    }
    var uniqueKeysArray = KeysArray.filter(onlyUnique);

    var result = [];
    for (j = 0; j < arrayKeys.length; j++) {
        if (arrayKeys[i] != 'title') {
            var someArray = arrayKeys[j].split("_");
            var someObj = {};
            var firstKey = uniqueKeysArray[0];
            if (someArray[0] == firstKey) {
                someObj[firstKey] = array[arrayKeys[j]];
                someObj.id = someArray[1];
                result.push(someObj);
            }
        }
    }

    for (i = 1; i < uniqueKeysArray.length; i++) {
        for (j = 0; j < arrayKeys.length; j++) {
            var someArray = arrayKeys[j].split("_");
            if (someArray[0] == uniqueKeysArray[i]) {
                for (l = 0; l < result.length; l++) {
                    if (someArray[1] == result[l].id) {
                        result[l][uniqueKeysArray[i]] = array[arrayKeys[j]];
                    }
                }
            }
        }
    }
    return result
}

//06.07 Set parameters for definition of unique values in array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

//06.08 Create array of countries described in story
function getCountryName() {
    var result = "";
    var countryId = [];
    $.each (countriesVisited, function( i, country ){
        if (local[0].includes(country.short_name)){
            countryId.push(country.short_name);
        }
    });

    if (countryId.length > 1) {
        result += "<ul class='back2country'>";
        $.each (countryId, function( i, country ){
            result += "<li><a id='" + country + "' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>" + getRusCountryName(country) + "</a></li>"
        });
        result += "</ul>";
    }
    else {
        result = "<div><a id='" + countryId[0] + "' class='back2country' onclick='javascript:getCountryPage(this.id)' onmouseover='' style='cursor: pointer;'>Back to country</a></div>";
    }

    return result;
}