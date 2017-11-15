var currentUser = "";
var creator;
var signedPeople = [];
var loadType;

$(document).ready(function(){

	function loadWatch() {
	$(".load").removeClass("loadShow");
	clearInterval(loadInterval);
	}

	function linkURL(theUrl) {
	  $(".load").addClass("loadShow");
	  var loadInterval = setInterval(loadWatch,1500);
	  window.location.href = theUrl;
	}

	$('#exploreButton').click(function() {
		linkURL("https://go-on.herokuapp.com/locatemap");
	});


});




var noteTemplate = function (data) {



	template = '<div class="note">';
/*	template += new Date(data.created_at);*/
     if(data.group && data.creator ){
     	template += '<div class="creatorContainer"><div class="biggerText"><strong id="creatorName">'+ data.creator + '</strong> ต้องการขอรับบริจาคเลือด กรุ๊ป<span id="groupName">' + data.group + '</span>';
           if(data.donationDate != ""){
              template += ' แบบเร่งด่วน ภายในวันที่' + data.donationDate + '</div>';
           }else{
              template += ' </div>';
           }
     }
     if(data.donationAddress && data.latlon){
     	template += '<a class="creatorLocation smallerText" href="http://maps.google.com/maps?q=loc:' + data.latlon + '" target="_blank"><i class="hospital icon"></i><strong>สถานที่นัดบริจาค</strong> <span class="lightText">' + data.donationAddress +'</span></a>';	
     }
     if(data.latlon){
     	template += '<div class="latlon">' + data.latlon + '</div></div>';	
     }
     if(data.joiner){
      template += '<div class="textContent smallerText"><span class="ui teal tiny label"><i class="add user icon"></i><span class="joiner">' + data.joiner + '</span></span> <span class="inlineBlock grey">ต้องการบริจาค</span></div><hr></hr>';  
     }
     if( data.notice && (data.poster != creator) ){
      template += '<div class="textContent notice smallerText"><i class="teal comment icon"></i><span class="teal"> ' + data.poster + "</span> <span class='inlineBlock grey'>" + data.notice + '</span></div><hr></hr>';  
     }
     if( data.notice && (data.poster == creator) ){
      template += '<div class="textContent notice"><span class="ui pink tiny label"><i class="comment icon"></i>' + data.poster + "</span> <span class='inlineBlock'>" + data.notice + '</span></div><hr></hr>';  
     }

	template += '</div>';



	return template;
};

// A function to accept an object and POST it to the server as JSON
function saveRecord (theData) {
	// Set the namespace for this note
	theData.namespace = mykey;

	$.ajax({
		url: "/a/save",
		contentType: "application/json",
		type: "POST",
		data: JSON.stringify(theData),
		error: function (resp) {

			// Add an error message before the new note form.
			$("#status").prepend("<p><strong>พบปัญหาในการโพส</strong></p>");
		},
		success: function (resp) {

			// Render the note
			var htmlString = noteTemplate(theData);
			$("#notes").append(htmlString);
			document.getElementById('status').innerHTML = "";
			loadNotes("done");
		}
	});
}

// Loads all records from the Cloudant database. 
// Loops through them and appends each note onto the page.
function loadNotes(noteLoadType) {


	$.ajax({
		url: "/a/api/"+mykey,
		type: "GET",
		data: JSON,
		error: function(resp){
		   var detailString = "<div style='color:red;'>พบปัญหาในการโหลด คลิกRefresh</div>"
          $("#status").html(detailString);
		},
		success: function (resp) {

			$("#notes").empty();
			$('#notes').append(btnString);


			// Use Underscore's sort method to sort our records by date.
			var sorted = _.sortBy(resp, function (row) { return row.doc.created_at;});

			// Now that the notes are sorted, add them to the page
			sorted.forEach(function (row) {
				var htmlString = noteTemplate(row.doc);
				$('#notes').append(htmlString);
				if (row.doc.creator){
				creator = row.doc.creator;
				signedPeople.push(row.doc.creator);
				}
				if (row.doc.joiner){
				signedPeople.push(row.doc.joiner);
				}
			}); // END FOR EACH

				if (signedPeople.indexOf(currentUser) > -1) {

	/*					if(currentUser == creator){*/
							 var btnString = '<textarea placeholder="พิมพ์ข้อความ (ex. นัดหมาย, รายละเอียด, การติดต่อ)" class="ui input controls" id="notice"></textarea><div class="ui button fluid" id="creatorButton"><i class="write icon"></i>ส่ง</div>';
							 $('#notes').append(btnString);
							 $('#creatorButton').on( 'click', creatorMenu );
					/*	}
*/
				} else {

						if (noteLoadType == "loginFirst"){
					      var btnString = '<div class="ui fluid  big blue button" id="loginjoinFacebook"><i class="facebook icon"></i>ลงชื่อบริจาค</div>';
					      var btnID = '#loginjoinFacebook';
					      $('#notes').prepend(btnString);
					       $('#loginjoinFacebook').on( 'click', loginFB );
						}else if (noteLoadType == "justPost"){
						  var btnString = '<div class="ui fluid  big red button" id="joinFacebook"><i class="add user icon"></i>บริจาค</div>';
						  var btnID = '#joinFacebook';
						  $('#notes').prepend(btnString);
						   $('#joinFacebook').on( 'click', postLinkToFB );
						}

				}


		}
	});
}





/************************* FACEBOOK API *****************************/


function testAPI() {
                FB.api('/me', function(response) {
                    document.getElementById('status').innerHTML = "";
                     currentUser = response.name;
                });
 
}

function creatorMenu() {

      var noticeMessage = $('#notice').val();

      if (noticeMessage == ""){
        $('#notice').addClass("error");
        $("#notice").focus(function() {
           $(this).removeClass("error");
        });
      }else{
               $('#notes').prepend('<div class="load loadShow"><div class="loader"></div></div>');
              var noteData = {
              notice: noticeMessage,
              poster: currentUser,
              created_at: new Date()
               };

            saveRecord(noteData);
      }

}

function postLinkToFB() {

    var group = $("#groupName").html();
    creator = $("#creatorName").html();
    var latlon = $(".latlon").html();

    var postname = creator + "กำลังหาเลือด กรุ๊ป" + group;
    var postdescription = currentUser + " ลงชื่อแสดงความประสงค์จะบริจาค";
    var mapstyle = "&zoom=18&maptype=hybrid&size=600x315&";
    var mapkey = "key=AIzaSyBlNl8tYOvWqEZ453CrQRGqRcnCXF-dUXQ";
    var postpicture = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + mapstyle + mapkey + "&markers=color:white|" + latlon;
    FB.ui( {
        method: 'feed',
        name: postname,
        link: "https://go-on.herokuapp.com/a/" + mykey,
        picture: postpicture,
        caption: "คลิก เพื่อร่วมบริจาค | GO-ON.CO" ,
        description: postdescription
    }, function( response ) {


        if (response.error_code){
          var detailString = "<div style='color:red;'>การโพสยังไม่เสร็จ กรุณาลองใหม่อีกครั้ง</div>"
          $("#status").html(detailString);
        }else{/************* POST TO FACEBOOK FINISHED ************/

      

     	var noteData = {
			joiner: currentUser,
			created_at: new Date()
		};

		//Send the data to our saveRecord function
		saveRecord(noteData);


        


        }/************* END OF POSTED TO FACEBOOK RESPONSE ************/


    }); //FB.UI

}/************* END OF POSTLINKTOFACEBOOK FUNCTION ************/


function loginFB() {

            FB.login(function(response) {
                if (response.authResponse) {
                  FB.api('/me', function(response) {
                       currentUser = response.name;
                       loadNotes("justPost");
                       if (signedPeople.indexOf(currentUser) > -1) {

                       }else{
                       	 postLinkToFB();
                       }

                   });

               
        
                } else {
                 document.getElementById('status').innerHTML = 'คุณได้ยกเลิกการล็อกอิน กรุณาล็อกอินเพื่อเริ่มใช้';
                }
            });

}

function statusChangeCallback(response) {

    if (response.status === 'connected') {
      // Logged into your app and Facebook.

                FB.api('/me', function(response) {
                    document.getElementById('status').innerHTML = "";
                     currentUser = response.name;
                     loadNotes("justPost");
                });


    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.

      loadNotes("loginFirst");
	  

      document.getElementById('status').innerHTML = '';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.

/* 	  $('#loginjoinFacebook').show();
 	  $('#loginjoinFacebook').on( 'click', loginFB );*/
 	  loadNotes("loginFirst");



      document.getElementById('status').innerHTML = '';
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
