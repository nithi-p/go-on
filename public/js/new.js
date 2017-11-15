var chosenAddress;
var facebookName;
var chosenDate;
var chosenTime;
var detailString;
var postUID;
var fullName;
var urgent;
/*var chosenDescription;*/

$(document).ready(function(){
    $('#login').on( 'click', loginFB );
    $('#post').on( 'click', postLinkToFB );
    $('#chooseAddress').on( 'click', chooseAddress );
    $('#datetimepicker').pickadate({
    monthsFull: [ 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม' ],
    monthsShort: [ 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.' ],
    weekdaysFull: [ 'อาทติย', 'จันทร', 'องัคาร', 'พุธ', 'พฤหสั บดี', 'ศกุร', 'เสาร' ],
    weekdaysShort: [ 'อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.' ],
    today: 'วันนี้',
    clear: 'ลบ',
    close: 'ปิด',
    format: 'd mmm yyyy',
    formatSubmit: 'd mmm yyyy'
    });


/*    $("#datetimepicker").focus(function() {
       $(this).removeClass("error");
    });*/


    $( "#urgent" ).click(function() {
        $('#datetimepickerContainer').show();
        $(this).addClass('mySelection');
        $("#routine").removeClass('mySelection');
        $("#normal").removeClass('mySelection');
        urgent = "ด่วน! ";
    });

    $( "#normal" ).click(function() {
        $('#datetimepickerContainer').hide();
        $(this).addClass('mySelection');
        $("#urgent").removeClass('mySelection');
        $("#routine").removeClass('mySelection');
        $('#datetimepicker').val("");
        urgent = "";
    });

    $( "#routine" ).click(function() {
        $('#datetimepickerContainer').hide();
        $(this).addClass('mySelection');
        $("#urgent").removeClass('mySelection');
        $("#normal").removeClass('mySelection');
        $('#datetimepicker').val("");
        urgent = "";
    });






}); // ON DOCUMENT READY


/**************************GLOBAL FUNCTION***************************/

function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
}

function saveMarker(obj){
  $.ajax({
    url: '/save',  // route
    type: 'POST',  // because WE ARE SENDING DATA!!!
    contentType: 'application/json',
    data: JSON.stringify(obj),  // send data as a string
    error: function(resp){
      $("#status").prepend("<p><strong>พบปัญหาในการโพส กรุณาลองใหม่</strong></p>");
    },
    success: function(resp){
        window.location.replace("/a/" + obj.namespace);
    }
  });
}


// A function to accept an object and POST it to the server as JSON
function saveRecord (theData) {

  $.ajax({
    url: "/a/save",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify(theData),
    error: function (resp) {
          $("#status").prepend("<p><strong>พบปัญหาในการโพส กรุณาลองใหม่</strong></p>");
    },
    success: function (resp) {




      var markerdata = {
      creator: theData.creator,
      lat: lat,
      lon: lon,
      group: group,
      namespace: theData.namespace
      };


    saveMarker(markerdata); 



      /*window.location.replace("/a/" + postUID);*/
    }
  });
}




/************************* END OF FACEBOOK API *****************************/
function postLinkToFB() {

    
    chosenDate = $('#datetimepicker').val();
    postUID = generateUID();



    var postname = urgent + "ขอรับบริจาคเลือด (กรุ๊ป" + group + ")" ; 
    var postdescription = "สถานที่บริจาค: " + chosenAddress + " | ลงประกาศโดย: " + facebookName;
    var mapstyle = "&zoom=" + zoom + "&maptype=hybrid&size=600x315&";
    var mapkey = "key=AIzaSyBlNl8tYOvWqEZ453CrQRGqRcnCXF-dUXQ";
    var postpicture = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + mapstyle + mapkey + "&markers=color:white|" + latlon;
    FB.ui( {
        method: 'feed',
        name: postname,
        link: "http://www.go-on.co/a/" + postUID,
        picture: postpicture,
        caption: "คลิก เพื่อดูรายละเอียด | GO-ON.CO" ,
        description: postdescription
    }, function( response ) {


        if (response.error_code){
          detailString = "<div style='color:red;'>กรุณาโพสใหม่อีกครั้ง เมื่อโพสลงเฟซบุ๊คของท่านแล้ว ระบบจะจึงโพสประกาศของท่านลงบนแผนที่โดยอัตโนมัติ</div>"
          $("#status").html(detailString);
        }else{/************* POST TO FACEBOOK FINISHED ************/

          $(".dashboard").html('<div><div class="load loadShow"><div class="loader"></div></div></div>');







          var newData = {
            namespace: postUID,
            creator: fullName,
            group: group,
            donationDate: chosenDate,
            donationAddress: chosenAddress,
            latlon: latlon,
            created_at: new Date()
          };

          //Send the data to our saveRecord function
          saveRecord(newData);




        


        }/************* END OF POSTED TO FACEBOOK RESPONSE ************/


    }); //FB.UI

}/************* END OF POSTLINKTOFACEBOOK FUNCTION ************/

function testAPI() {
   
                FB.api('/me', function(response) {
                    document.getElementById('status').innerHTML = '<span class="lightText">โดย</span> ' + response.name;
                     $(".dashboard").hide();
                     $('#login').hide();
                     
                 });

                FB.api('/me', {fields: 'first_name'}, function(response) {
                  facebookName = response.first_name;
                });

                FB.api('/me', function(response) {
                     fullName = response.name;
                });

}


function loginFB() {

            FB.login(function(response) {
                if (response.authResponse) {
                 FB.api('/me', {fields: 'first_name'}, function(response) {
                   facebookName = response.first_name;
                    document.getElementById('status').innerHTML = "คุณ " + facebookName;
                     $(".dashboard").hide();
                     $('#login').hide();
                 });

                  FB.api('/me', function(response) {
                       fullName = response.name;
                  });
        
                } else {
                 document.getElementById('status').innerHTML = 'คุณได้ยกเลิกการล็อกอิน กรุณาล็อกอินเพื่อเริ่มใช้<div><i class="down arrow icon"></i></div>';
                }
            });

}

function statusChangeCallback(response) {

    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      $('#login').show();
      document.getElementById('status').innerHTML = 'กรุณายืนยันตัวตน<div><i class="down arrow icon"></i></div>';



    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      $('#login').show();
      document.getElementById('status').innerHTML = 'กรุณายืนยันตัวตน<div><i class="down arrow icon"></i></div>';
    }
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1325948244115986',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });


  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

/************************* END OF FACEBOOK API *****************************/


/************************* START OF GOOGLE MAP API *****************************/
var center;

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

    center = map.getCenter();
    getmapData(center.lat(),center.lng());

    /*getAllData(map); */ // START GET ALL THE MARKERS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   /* getmapData(lat, lon); */ // START GEOCODING WITH THE LATLON VARIABLE

    google.maps.event.addListener(map, 'drag', function() {
        center = map.getCenter();
        $(".mapMenu").hide();
        $(".textMenu").hide();
        $("#pac-input").hide();
    });
    google.maps.event.addListener(map, 'dragend', function() {
        getmapData(center.lat(),center.lng());
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


    center = map.getCenter();
    getmapData(center.lat(),center.lng());


  });/*END OF PLACE SEARCHING*/

} // end MAP initialize




function getmapData(newLat,newLon){
  var mapURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var searchURL = mapURL + newLat +','+ newLon + '&key=AIzaSyBlNl8tYOvWqEZ453CrQRGqRcnCXF-dUXQ';

    latlon = newLat + "," + newLon;
    lat = newLat;
    lon = newLon;
  
  $.ajax({   // SET UP AJAX
    url: searchURL,
    type: 'GET',
    dataType: 'json', //different API --> different dataType
    error: function(data){
      console.log("We got problems when getmapdata");
      console.log(data);
    },
    success: function(data){
      console.log("GETMAPDATA SUCCEED!!!");
     theAddressString = data.results[0].formatted_address;

     $( "#theAddress" ).val(theAddressString);

    }
  }); // END SET UP AJAX

}// END GET MAP DATA




/************************* END OF OF GOOGLE MAP API *****************************/


/************************* OTHER FUNCTIONS *****************************/
function chooseAddress(){
chosenAddress = $( "#theAddress" ).val();
$( ".dashboard" ).show();
detailString =  '<div class="smallerText"><i class="marker icon"></i>' + chosenAddress + "</div>" ;
$("#status").html(detailString);
$('#datetimepickerContainer').hide();
$('#finalForm').show();
$('.mapMenu').hide();
$('#mapContainer').hide();
}





/************************* END OF OTHER FUNCTIONS *****************************/



 