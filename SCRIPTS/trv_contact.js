//08. Contacts
//08.01 Creator of Contact page
function HTML_CreatorOfContactPage (){
    document.getElementById("someElement").innerHTML = "<div class='jumbotron'>" +
        "<h2><b> Контакты </b></h2>" +
        "<p> Location: Kyiv, Ukraine </p>" +
        "<p> Email: <a href='mailto:coatls77@gmail.com'>coatls77@gmail.com</a></p>" +
        "<p> Skype: slavutskyy </p>" +
        "</div>";
}
//09. Contacts
//09.01 Creator of About page
function HTML_CreatorOfAboutPage () {
    document.getElementById("someElement").innerHTML = "<div class='well'>" +
          "<h2><b> О проекте </b></h2>" +
          "<p><b>Version</b>: 8.0.1</p>" +
          "<p><b>Compatibility Google Chrome</b>: 1.0+ </p>" +
          "<p><b>Compatibility Internet Explorer</b>: 8.0+</p>" +
          "<p><b>Technologies</b>: HTML, CSS, XML, Json, JScript, <a href='http://www.amcharts.com/javascript-maps/' target='_blank'>AMMAP (maps)</a>," +
          " <a href='http://getbootstrap.com/' target='_blank'>Bootstrap (themes)</a>.</p>" +
          "<p>Здравствуйте. Мое имя Славутский Алексей и это мой личный сайт. Существует множество подобных сайтов, но этот мой! " +
          "Здесь собрана вся информация о моих путешествиях. Тут вы можете найти фотографии, отчеты о поездках, список посещенных мною территорий и еще многое о моем увлечении туризмом. " +
          "Вся информация, содержащаяся на сайте и сам этот сайт - результаты моей многолетней работы и поездок. Изначально был просто список стран в файле Word, который со временем, " +
          "благодаря моему увлечению интернетом и сопутствующими ему технологиями превратился в то, что вы видите перед собой. Не знаю, куда заведет меня эта дорога, но рад буду это выяснить. " +
          "Вот и все что я хотел сказать.</p>" +
          "<p>Приятного просмотра!</p></div>";
}

//10. SignIn Page
//10.01 Navigation to SignIn page
function HTML_SignInPage () {	
	var url = "settings.html";
	location.href = url;
}