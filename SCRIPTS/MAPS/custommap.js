   function CreateMap ()
   {
      var map;
      var worldDataProvider;

      map = new AmCharts.AmMap();
      map.pathToImages = "SCRIPTS/MAPS/images/";
      map.mouseWheelZoomEnabled = true;

      worldDataProvider =
      {
          getAreasFromMap: true,

          getMap: function (code) {
              return AmCharts.maps[code];
          }
      };

      MapSelection(worldDataProvider,  AmCharts); //This function selects the appropriate map to work with
      CountryList(worldDataProvider); //This function colour the area(countries I have visited)
      //ZoomToVisit(zoom, worldDataProvider); //This function works onmouseover for visit links
      CityList(worldDataProvider); //This function populate country map with cities once the map is loaded
		
      map.dataProvider = worldDataProvider;

      map.areasSettings = 
      {
          autoZoom: false,
          rollOverOutlineColor: "#000000",
          color: "#A4A4A4"
      };

      var div = document.getElementById('mapdiv');
      if (typeof map.dataProvider.mapVar != "undefined") 
      {
          map.write("mapdiv");
      }
	  else { div.style.height = 0; }
      //else { div.innerHTML = "<img alt='Map is missing' src='IMG/icon/mapismissing.png'>"; }
   }

   var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
   var citiSVG = "M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z";

   function MapSelection(worldDataProvider, AmCharts) 
   {
       var country_list = document.getElementById('countryList').innerHTML;
       var country_array = country_list.split(",")
       var option = country_array[0];
       var mapObject = worldDataProvider.getMap(option);
           worldDataProvider.mapVar = mapObject; 
   }

   function CountryList(worldDataProvider) 
   {
       var country_list = document.getElementById('countryList').innerHTML;
       var country_array = country_list.split(",");
       var countries = [];

       if (country_array.length>2)
       {
           for (var i = 1; i < country_array.length - 1; i++) 
           {
               countries.push({
                  id: country_array[i],
                  color: "#088A4B"
               });

          worldDataProvider.areas = countries;
           }   
       }
    }

    function CityList(worldDataProvider) 
    {
       var city_list = document.getElementById('cityList').innerHTML;
       var city_array = city_list.split(";");
       var cities = [];

       if (city_array[0] != "world")
       {
           for (var i = 1; i < city_array.length - 1; i++) 
           {
               var citydata_array = city_array[i].split(",");
                   cities.push({
                       svgPath: citiSVG,
                       title: citydata_array[0],
                       latitude: citydata_array[1],
                       longitude: citydata_array[2],
                       color: "#FAAC58",
                       fixedSize: false,
                       scale: 0.5
                   });
           }

           worldDataProvider.images = cities;
        }
   }

   function ZoomToVisit(zoom, worldDataProvider) 
   {
      var country_list = document.getElementById('countryList').innerHTML;
      var country_array = country_list.split(",")

      if (country_array[0] == "world") 
      {
          if (zoom != "none") {
              var zoom_array = zoom.split(";");
              var cities = [];
              var zoomLvl, zoomLat, zoomLong;

              for (var i = 0; i < zoom_array.length - 1; i++) {
                  var imageSettings = zoom_array[i].split(",");

                  if (i == 0) {
                      zoomLvl = imageSettings[0];
                      zoomLat = imageSettings[1];
                      zoomLong = imageSettings[2];
                  }
                  else {
                      cities.push({
                          svgPath: targetSVG,
                          title: imageSettings[0],
                          latitude: imageSettings[1],
                          longitude: imageSettings[2]
                      });
                  }
              }

              worldDataProvider.images = cities;
              worldDataProvider.zoomLevel = zoomLvl;
              worldDataProvider.zoomLatitude = zoomLat;
              worldDataProvider.zoomLongitude = zoomLong;
          }
          else {
              worldDataProvider.zoomLevel = 1;
              worldDataProvider.zoomLongitude = "10";
              worldDataProvider.zoomLatitude = "44";
          }
      }
}

// AmCharts.ready(function () { CreateMap("none"); });

