/************************** Global **************************/








/************************** END OF GLOBAL **************************/
/************************** **************************/


$(document).ready(function(){





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
    /*var theUrl = "/location?project=" + thisProjectName; *///TESTING
    linkURL(theUrl);
    }

}

/*LINKS LIST!!!!!!!!!!!!!!!!!!*/

$( "#searching" ).click(function() {
  linkURL("https://go-on.herokuapp.com/locatemap");
});

$( "#asking, #announce" ).click(function() {
  $( ".displayNone" ).toggle();
});

$( "#instructionBtn" ).click(function() {
  $( "#instruction" ).toggle();
});

$( "#whatyougetBtn" ).click(function() {
  $( "#whatyouget" ).toggle();
});

$( ".closeBtn" ).click(function() {
  $( ".modal" ).hide();
});

$( ".bloodButton" ).click(function() {
    thisGroup = $(this).children("div").text();
    newGroup(thisGroup);
});

$( "#chrome" ).click(function() {
    var redirectUrl = "http://www.go-on.co/chrome?group=" + thisGroup; 
    window.open('https://www.facebook.com/dialog/oauth?client_id=1325948244115986&redirect_uri='+ redirectUrl, '', null);
});



});










/************************** Angular **************************/



var zero = 0;
var firstName;
var lastName;
var fullName;
var loginStatus;




var app = angular.module("myApp", ["firebase"]);

app.controller("myCtrl", function($scope, $firebaseObject, $firebaseArray) {

  var ref = firebase.database().ref().child("currentNum");
  // download the data into a local object
  var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncObject.$bindTo($scope, "currentNum");



    

       var datesRef = firebase.database().ref().child("timeline");
     var datesInfo = $firebaseArray(datesRef);

     $scope.signedPeople = [];
     $scope.allSundays = [];





        datesInfo.$loaded().then(function(data) {
            $scope.dates = datesInfo;
            $('.swiper-container, .slideContainer').show();
            var allSundays2017 = $scope.sunday(2017);
            var allSundays2018 = $scope.sunday(2018);
            $scope.allSundays = allSundays2017.concat(allSundays2018);



            for(var i=0, len = datesInfo.length; i < len; i++) {
        $scope.signedPeople.push(datesInfo[i].fullname);
      }


    }); 


         $scope.loginFB = function(indexNo) {


              FB.login(function(response) {
                    if (response.authResponse) {
                     loginStatus = 1;
                     FB.api('/me', {fields: 'first_name,last_name'}, function(res) {
                      firstName = res.first_name;
                      lastName = res.last_name;
                      fullName = firstName + ' ' + lastName;


                        if ($scope.signedPeople.indexOf(fullName) > -1) {
                          $("#status").html("Cannot book more than 1 slot");
                }else{
                  var ref = firebase.database().ref().child("timeline");
                      var timelineRef = ref.child(indexNo);
                  timelineRef.update({
                    "fullname" : fullName
                  },
                   function(error) {
                    if (error) {
                      $("#status").html("There's something wrong. " + error);
                    }
                  });
                  $scope.signedPeople.push(fullName);

                  //ADD TO BOX
                  var refbox = firebase.database().ref().child("box");
                      var boxRef = refbox.child(indexNo);
                  boxRef.update({
                    "firstname" : firstName,
                    "lastname" : lastName
                  },
                   function(error) {
                    if (error) {
                      $("#status").html("There's something wrong. " + error);
                    }
                  });




                }
                      

                     });
            
                    } else {
                     document.getElementById('status').innerHTML = 'Please log in first';
                    }
                });



          }




          $scope.sign =  function(indexNo) {



              if(loginStatus == 1){


                                  if ($scope.signedPeople.indexOf(fullName) > -1) {
                                    $("#status").html("Cannot book more than 1 slot");
                          }else{

                            var ref = firebase.database().ref().child("timeline");
                                  var timelineRef = ref.child(indexNo);
                              timelineRef.update({
                                "fullname" : fullName
                              },
                               function(error) {
                                if (error) {
                                  $("#status").html("There's something wrong. " + error);
                                }
                              });
                              $scope.signedPeople.push(fullName);

                              //ADD TO BOX
                              var refbox = firebase.database().ref().child("box");
                                  var boxRef = refbox.child(indexNo);
                              boxRef.update({
                                "firstname" : firstName,
                                "lastname" : lastName
                              },
                               function(error) {
                                if (error) {
                                  $("#status").html("There's something wrong. " + error);
                                }
                              });



                          }
                      

                    }else{

                      var standalone = window.navigator.standalone,
                        userAgent = window.navigator.userAgent.toLowerCase(),
                        safari = /safari/.test( userAgent ),
                        ios = /iphone|ipod|ipad/.test( userAgent );

                    if( ios ) {
                      $("#loginFirst").show();
                    }else{
                      $scope.loginFB(indexNo);
                    }


                    }



    






          

          } // END SIGN FUNCTION

          $scope.loginIOS =  function() {
               var redirectUrl = "http://www.go-on.co/join"; 
               window.open('https://www.facebook.com/dialog/oauth?client_id=1325948244115986&redirect_uri='+ redirectUrl, '', null);
          }


          $scope.cannot =  function() {
                 $("#status").html("Someone has already reserved :)");
          }

          $scope.addDate =  function() {

                if ($scope.allSundays[datesInfo.length-4]){
                  var ref = firebase.database().ref().child("timeline");
                var timelineRef = ref.child(datesInfo.length);
                timelineRef.update({
                  date : $scope.allSundays[datesInfo.length-4],
                  ref : datesInfo.length
                },function(error) {
                   if (error) {
                    $("#status").html("There's something wrong. " + error);
                  }
                });
                }else{
                  $("#status").html("Cannot add more date");
                }
                  
          }

          $scope.sunday = function (year) {
          var date = new Date(year, 0, 1);
          while (date.getDay() != 0) {
            date.setDate(date.getDate() + 1);
          }
          var days = [];
          while (date.getFullYear() == year) {
            var m = date.getMonth();
           var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          var d = new Date();
          var mn = monthNames[m];


            var d = date.getDate();
            days.push(
             mn + ' ' +
              d + ', ' +
              year
            
              
            );
            date.setDate(date.getDate() + 7);
          }
          return days;
        }






    /************************* FACEBOOK API *****************************/








function statusChangeCallback(response) {

    if (response.status === 'connected') {
      // Logged into your app and Facebook.
                     FB.api('/me', {fields: 'first_name,last_name'}, function(res) {
                      firstName = res.first_name;
                      lastName = res.last_name;
                      fullName = firstName + ' ' + lastName;
                     });

        loginStatus = 1;




    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      loginStatus = 0;

    } else {
       loginStatus = 0;
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













}); // END OF ANGULAR CONTROLLER







