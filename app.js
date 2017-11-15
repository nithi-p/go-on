var express = require('express');

var Request = require('request');
var bodyParser = require('body-parser');

var app = express();

// Set up the public directory to serve our Javascript file
app.use(express.static(__dirname + '/public'));
// Set EJS as templating language
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// Enable json body parsing of application/json
app.use(bodyParser.json());


// LINK TO NODE MODULE
app.use('/module', express.static(__dirname + '/node_modules/'));



//******* DATABASE Configuration *******
// The username you use to log in to cloudant.com
var CLOUDANT_USERNAME="notenithii";
// The name of your database
var CLOUDANT_DATABASE="test";
// These two are generated from your Cloudant dashboard of the above database.
var CLOUDANT_KEY="sentrandscirseatiouttlyi";
var CLOUDANT_PASSWORD="oSPNjAFgSpWjmXi2EmqtjQC1";

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;







//******* ROUTES *******
// GET - route to load the main page
app.get("/", function (request, response) {

	response.render('index', {title: "Let's make someone's life go on"});
});

app.get("/box", function (request, response) {
	
	response.render('test', {title: "The Digital Exhibition"});
});

app.get("/join", function (request, response) {
	var log = request.query.login;
	response.render('join', {title: "JOIN THE GO-ON PROJECT", login: log});
});

app.get("/about", function (request, response) {
	response.render('about', {title: "เกี่ยวกับเรา"});
});

app.get("/home", function (request, response) {
	response.render('index', {title: "Let's make someone's life go on"});
});


app.get("/privacy", function (request, response) {
	response.render('privacy', {title: "นโยบายความเป็นส่วนตัว"});
});

app.get("/terms", function (request, response) {
	response.render('terms', {title: "ข้อตกลงการใช้งาน"});
});

app.get("/location", function (request, response) {

	var grp = request.query.group;
	response.render('location', {title: "แสกนหาตำแหน่ง", group: grp});
});

app.get("/locatemap", function (request, response) {
	response.render('locatemap', {title: "แสกนหาตำแหน่ง"});
});



app.get("/chrome", function (request, response) {
	var grp = request.query.group;
	response.render('chrome', {title: "ล็อกอิน", group: grp});
});



app.get("/new", function (request, response) {
	var grp = request.query.group;
	var lt = request.query.lat;
	var ln = request.query.lon
 	response.render('new', {title: "ลงประกาศขอรับบริจาคเลือด", group: grp, lat: lt, lon: ln});
});


app.get("/map", function (request, response) {
	var lt = request.query.lat;
	var ln = request.query.lon
 	response.render('map', {title: " ค้นหาผู้ที่กำลังต้องการเลือด", lat: lt, lon: ln});
});







// POST - route to create a new note.
app.post("/save", function (request, response) {
	console.log("Making a post!");
	// Use the Request lib to POST the data to the CouchDB on Cloudant
	Request.post({
		url: CLOUDANT_URL,
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true,
		body: request.body
	},
	function (err, res, body) {
		if (res.statusCode == 201){

			response.json(body);
		}
		else{
			console.log('Error: '+ res.statusCode);
			console.log(body);
		}
	});
});



//JSON Serving route - ALL Data
app.get("/api/all", function(req,res){

	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: CLOUDANT_URL+"/_all_docs?include_docs=true",
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		//Send the data
		res.json(theRows);
	});
});




//******* DATABASE Configuration2 *******
// The username you use to log in to cloudant.com
var CLOUDANT_USERNAME2="notenithii";
// The name of your database
var CLOUDANT_DATABASE2="blog-summer";
// These two are generated from your Cloudant dashboard of the above database.
var CLOUDANT_KEY2="andranduretterelyingster";
var CLOUDANT_PASSWORD2="Vk8S77wwSWiSK0pSv8FAShMN";

var CLOUDANT_URL2 = "https://" + CLOUDANT_USERNAME2 + ".cloudant.com/" + CLOUDANT_DATABASE2;






// POST - route to create a new note.
app.post("/a/save", function (request, response) {

	// Use the Request lib to POST the data to the CouchDB on Cloudant
	Request.post({
		url: CLOUDANT_URL2,
		auth: {
			user: CLOUDANT_KEY2,
			pass: CLOUDANT_PASSWORD2
		},
		json: true,
		body: request.body
	},
	function (err, res, body) {
		if (res.statusCode == 201){
			response.json(body);
		}
		else{
			console.log('Error: '+ res.statusCode);
			console.log(body);
		}
	});
});




// GET - API route to get the CouchDB data after page load.
app.get("/a/api/:key", function (request, response) {
	var theNamespace = request.params.key;
	// Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: CLOUDANT_URL2+"/_all_docs?include_docs=true",
		auth: {
			user: CLOUDANT_KEY2,
			pass: CLOUDANT_PASSWORD2
		},
		json: true
	}, function (err, res, body){
		//Grab the rows
		var theData = body.rows;

		// And then filter the results to match the desired key.
		var filteredData = theData.filter(function (d) {
			return d.doc.namespace == request.params.key;
		});

		// Now use Express to render the JSON.
		response.json(filteredData);
		
	});
});

// GET - Route to load the view and client side javascript to display the notes.
app.get("/a/:key", function (request, response) {
	response.render('notes',{title: "ลงชื่อ", key: request.params.key});
});







// GET - Catch All route
app.get("*", function(request,response){
	response.send("Sorry, nothing to see here.");
});


var port = process.env.PORT || 5000; // add an "environment" variable called port


app.listen(port);

console.log('Express started on port :' + port);