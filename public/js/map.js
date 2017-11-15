




/*var chosenDescription;*/

$(document).ready(function(){


  $( "#closeButton" ).click(function() {
        $('#fellowInfo').toggle();
  });


  $('#newGroupButton').click(function() {
    $('#activities').toggle();
  });


  $( "#closeActivities" ).click(function() {
        $('#activities').toggle();
  });

/**************** LINK AND LOADER WITH BACK BUTTON PROBLEM SAFARI ***********/
var loadInterval;
var thisGroup;


function loadWatch() {
  $(".load").removeClass("loadShow");
  clearInterval(loadInterval);
}

function linkURL(theUrl) {
  $(".load").addClass("loadShow");
  var loadInterval = setInterval(loadWatch,1500);
  window.location.href = theUrl;
}

function loadURL(theUrl) {
  $(".load").addClass("loadShow");
  var loadInterval = setInterval(loadWatch,1500);
  window.location.replace(theUrl);
}

function newGroup(theGroup) {

    if( navigator.userAgent.match('CriOS') ){//  CHORME FOR IOS DEBUG
    $("#chrome").show("fast");  
    }else{ // ANY OTHER BROWSERS
    var theUrl = "https://go-on.herokuapp.com/location?group=" + theGroup; //PRODUCTION
    /*var theUrl = "/location?group=" + thisGroup; *///TESTING
    linkURL(theUrl);
    }

}

/*LINKS LIST!!!!!!!!!!!!!!!!!!*/


$( ".bloodButton" ).click(function() {
    thisGroup = $(this).children('div').text();
    newGroup(thisGroup);
});

$( "#chrome" ).click(function() {
    var redirectUrl = "https://go-on.herokuapp.com/chrome?group=" + thisGroup; 
    window.open('https://www.facebook.com/dialog/oauth?client_id=1325948244115986&redirect_uri='+ redirectUrl, '', null);
});




}); // ON DOCUMENT READY


/**************************GLOBAL FUNCTION***************************/









/************************* START OF GOOGLE MAP API *****************************/
var center;


function setMarkers(map, locations) {

  var image = {
    url: 'js/manicon.png',
    size: new google.maps.Size(32, 40),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(16, 40)
  };





  for (var i = 0; i < locations.length; i++) {
    var eachfellow = locations[i];
    var myLatLng = new google.maps.LatLng(eachfellow[1], eachfellow[2]);
    allmarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        name: eachfellow[0],
        group: eachfellow[3],
        namespace: eachfellow[4]
    });













          google.maps.event.addListener(allmarker, 'click', function() {
                    var nameString = this.name;
                    var groupString = this.group;
                    var namespaceString = "../a/" + this.namespace;
                    $('#userInfo').html(nameString);
                    $('#groupInfo').html(groupString);
                    $("#thisLink").attr("href", namespaceString);
                    $('#fellowInfo').toggle();
                    

          });



  }




} // end setMarker




function getAllData(mapdata){
  $.ajax({
    url: '/api/all',
    type: 'GET',
    dataType: 'json',
    error: function(data){
      console.log(data);
      alert("Oh No! Try a refresh?");
    },
    success: function(data){

 
      var theData = data.map(function(d){ //loop through the object and put in new array
        return d.doc;
      });

      var fellows = [];

       theData.forEach(function(d){
          fellows.push([d.creator, d.lat, d.lon, d.group, d.namespace]);
        });


        setMarkers(mapdata, fellows);

    }
  });
/*  return fellows;*/
}



function initMap() {

  var mapOptions = {
    zoom: 18,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
    },
       styles: [{

      stylers: [{
        saturation: -100
      }]
   }]
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    lat = parseFloat(lat);
    lon = parseFloat(lon);

    var pos = new google.maps.LatLng(lat,lon);
    map.setCenter(pos);



    getAllData(map);

/*    center = map.getCenter();
    getmapData(center.lat(),center.lng());*/



    google.maps.event.addListener(map, 'drag', function() {

        $(".mapMenu").hide();
        $(".textMenu").hide();
        $("#pac-input").hide();
    });
    google.maps.event.addListener(map, 'dragend', function() {

        $(".mapMenu").show();
        $(".textMenu").show();
        $("#pac-input").show();
    });




  /*PLACE SEARCHING*/

  var input = document.getElementById('pac-input');

  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  google.maps.event.addListener(autocomplete, 'place_changed', function() { /*PLACE CHANGED*/

    marker.setVisible(false);

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Google Mapไม่พบสถานที่นั้น");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);

    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }


/*    center = map.getCenter();
    getmapData(center.lat(),center.lng());*/


  });/*END OF PLACE SEARCHING*/

} // end MAP initialize








/************************* END OF OF GOOGLE MAP API *****************************/


/************************* OTHER FUNCTIONS *****************************/
function chooseAddress(){



$('.mapMenu').hide();
$('#mapContainer').hide();
}


/************************* END OF OTHER FUNCTIONS *****************************/



 