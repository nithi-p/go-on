var center;
var theAddressString;
var fellows = [];
var allmarker;
var fellowString;
/*
var date = new Date;
date.setTime(result_from_Date_getTime);

var seconds = date.getSeconds();
var minutes = date.getMinutes();
var hour = date.getHours();

var year = date.getFullYear();
var month = date.getMonth(); // beware: January = 0; February = 1, etc.
var day = date.getDate();

var dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, etc.
var milliSeconds = date.getMilliseconds();

*/







function redirect(name){
      var redi = "/a/" + name;
      console.log(redi);
      window.location.replace(redi);
}
 






function makeHTML(theData){
  var htmlString = '<ol>';

  theData.forEach(function(d){
    htmlString += '<li>' + d.user + ' : ' + d.lat + ',' + d.lon + '</li>';
    //fellows.push([d.user, d.lat, d.lon, 1]);
  });
  htmlString += '</ol';
  //console.log(fellows);
  //return htmlString;





}


 function getmapData(newLat,newLon){
  var mapURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var searchURL = mapURL + newLat +','+ newLon + '&key=AIzaSyBlNl8tYOvWqEZ453CrQRGqRcnCXF-dUXQ';
  console.log(searchURL);

  //$.ajax({ create object here });
  $.ajax({   // SET UP AJAX
    url: searchURL,
    type: 'GET',
    dataType: 'json', //different API --> different dataType
    error: function(data){
      console.log("We got problems");
      console.log(data);
    },
    success: function(data){
      console.log("WooHoo!!!");
      console.log(data.results[0].formatted_address);







     theAddressString = data.results[0].formatted_address;
     //$('#theAddress').html(theAddressString);

     $( "#theAddress" ).val(theAddressString);












    }
  }); // END SET UP AJAX


}// END GET MAP DATA








        $(document).mousemove(function(e){
            $("#fellowInfo").css({left:e.pageX+25, top:e.pageY-25});
        });









function setMarkers(map, locations) {
  // Add markers to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var image = {
    url: 'js/maniconblue.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(32, 40),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(16, 40)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
/*  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };*/
  for (var i = 0; i < locations.length; i++) {
    var eachfellow = locations[i];
    var myLatLng = new google.maps.LatLng(eachfellow[1], eachfellow[2]);
    console.log(eachfellow);
    allmarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        name: eachfellow[0],
        address: eachfellow[3],
        hour: eachfellow[4],
        minute: eachfellow[5],
        address2: eachfellow[6],
        desc: eachfellow[7]
    });



/*var d = new Date();
var m = d.getMinutes();
var h = d.getHours();



if (m<10){
  console.log(h+":0"+m);
}else{
  console.log(h+":"+m);
}*/











   google.maps.event.addListener(allmarker, 'mouseover', function() {

    var d = new Date();
    var m = d.getMinutes();
    var h = d.getHours();
    var numhourleft = this.hour-h;
    var hourleft = numhourleft.toString();
    var minleft = this.minute-m;
    var thanString;

    if (numhourleft<=0){
      $('#count').html("Expired");
    }

    else if (minleft>0){
      thanString = "More than ";
      $('#count').html( "Expire at <span class='bigger'>"+ this.hour +"</span> : <span class='bigger'>" + this.minute +"</span><br>"+ thanString+"<span class='bigger'>"+hourleft+"</span> hour(s) to go<br><br>"+this.desc);
    }else{
      thanString = "Less than ";
      $('#count').html( "Expire at <span class='bigger'>"+ this.hour +"</span> : <span class='bigger'>" + this.minute +"</span><br>"+ thanString+"<span class='bigger'>"+hourleft+"</span> hour(s) to go<br><br>"+this.desc);
    }



      //$('#count').countdown({until: '+' + hourleft + 'h +0m +0s', format: 'YOWDHMS', significant: 3});


    fellowString = this.name;
      $('#fellowInfo').fadeIn('fast');
      $('#info').html(fellowString);
    });

  google.maps.event.addListener(allmarker, 'mouseout', function() {
  $('#fellowInfo').fadeOut('fast');
  //$('#count').countdown({until: '+' + 0 + 'h +0m +0s', format: 'YOWDHMS', significant: 3});

});


google.maps.event.addListener(allmarker, 'click', function() {

       $("#formcontainer2").toggle().html("<button id='iamin'>I'm in !</button><br>");
      $('#iamin').click(function(){
           redirect(fellowString);
        });

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
      console.log("We have data from our database");
      //Clean up the data on the client
      //You could do this on the server
      var theData = data.map(function(d){ //loop through the object and put in new array
        return d.doc;
      });
      /*var htmlString = makeHTML(theData);
      $('#alldata').append(htmlString);*/


       theData.forEach(function(d){
          fellows.push([d.user, d.lat, d.lon, d.address, d.hour, d.minute, d.address2, d.description]);
        });
        //console.log("here is fellows array from getAllData function");
        //console.log(fellows);
        //return htmlString;
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
       styles: [{

      stylers: [{
        saturation: -100
      }]
   }]
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

/*  var contentString = 
      '<h1 id="firstHeading" class="firstHeading">IS THIS YOUR LOCATION?</h1>'+
      '<div id="bodyContent">'+
      '<button id="save">YES</button>'+
      '</div>';*/

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      //sendPlace('null','null',position.coords.latitude,position.coords.longitude);
      //getmapData(latestLat,latestLon);

/*
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: contentString
      });*/

      map.setCenter(pos);

      getAllData(map);


      console.log(position.coords.latitude);
      console.log(position.coords.longitude);

    getmapData(position.coords.latitude,position.coords.longitude);  // START BY USER LOCATION


        /*  var marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  title: 'Hello World!'
            });*/
              
                  

                  google.maps.event.addListener(map, 'drag', function() {
                      center = map.getCenter();
                  });

                  google.maps.event.addListener(map, 'dragend', function() {
                      //infowindow.setPosition(center);

                      getmapData(center.lat(),center.lng());


                  });













    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }




  

  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

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

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    //infowindow.close();
    marker.setVisible(false);

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(18);  // Why 17? Because it looks good.
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

   //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
   // infowindow.open(map, marker);
    center = map.getCenter();
    getmapData(center.lat(),center.lng());

    //setMarkers(map, fellows);
    
    //sendPlace(place.name,address,place.geometry.location.A,place.geometry.location.F); //send data

  });



  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
/*  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    google.maps.event.addDomListener(radioButton, 'click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);*/


 

} // end initialize















function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}




/*
google.maps.event.addDomListener(window, 'load', initMap);


*/


function saveData(obj){
  $.ajax({
    url: '/save',  // route
    type: 'POST',  // because WE ARE SENDING DATA!!!
    contentType: 'application/json',
    data: JSON.stringify(obj),  // send data as a string
    error: function(resp){
      console.log("Oh no...");
      console.log(resp);
    },
    success: function(resp){
      console.log('WooHoo!');
      console.log(resp);
      var htmlString = '<li>' + obj.user + ' : ' + obj.lat + ',' + obj.lon + '</li>';
      $('ol').append(htmlString);
      window.location.replace("/");
    }
  });
}





$(document).ready(function(){





  $('#fellowInfo').hide();

var d = new Date();
var m = d.getMinutes();
var h = d.getHours();


$('#timepicker_hours').timepicker({
    hours: { starts: h, ends: 23 },
    showMinutes: false,
    showPeriod: false,
    showLeadingZero: false
});
$('#timepicker_minutes').timepicker({
    showHours: false
});

  $("#formcontainer2").hide();



  $('#enterButton').click(function(){
    var userName = $("#userName").val() || 'unknown';
    var sendLat = center.lat();
    var sendLon = center.lng();
    var addr = theAddressString;
    var addr2 = $('#theAddress2').val();
    var desc = $('#desc').val();
    var hourinput = $('#timepicker_hours').val();
    var mininput = $('#timepicker_minutes').val();
    var timeStamp = new Date();
    //Create data object to be saved
    var data = {
      user: userName,
      lat: sendLat,
      lon: sendLon,
      address: addr,
      address2: addr2,
      description: desc,
      hour: hourinput,
      minute: mininput,
      date: timeStamp
    };
    console.log(data);
    saveData(data); // craig wrote it ,not built in
  });



});



