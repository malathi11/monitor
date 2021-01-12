/*
*  Primary File for the API
*
*/

// Dependencies 

const http = require('http');
const https = require('https');
const url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Intatiating the http server
const serverHttp = http.createServer(function(req, res) {
		unifiedServer(req,res)
});

// Intatiating the https server
var httpServerOptions = {
	'key' :  fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem')
}

const serverHttps = https.createServer(httpServerOptions, function(req, res) {
		unifiedServer(req,res)
});

//Start Server and listen on port 
 
serverHttp.listen(config.httpPort, function(){
	console.log("The server is listening on port "+config.httpPort+" in "+config.envName)
});

serverHttps.listen(config.httpsPort, function(){
	console.log("The server is listening on port "+config.httpsPort+" in "+config.envName)
});

// All the server logic for both http and https 
var unifiedServer = function(req, res) {
//Get the Url
	//the true parameter is asking to use the query library
	var parsedUrl = url.parse(req.url, true)
	

	//Get the Path
	var path = parsedUrl.pathname
	var trimpath = path.replace(/^\/+|\/+$/g,'')


	//Get the query string as an object
	var queryobject = parsedUrl.query;

	// Get the Http Method

	var method = req.method.toLowerCase();

	//Get the headers as an object

	var headers = req.headers;

	//Send the response 

	var decoder = new StringDecoder('utf-8')
	var buffer = '';
	req.on('data',function(data) {
		buffer += decoder.write(data)
	})

	req.on('end',function() {
		buffer += decoder.end();

		//Choose the handler the request should go to

		var chosenhandler = typeof(router[trimpath]) !== 'undefined' ?
		  router[trimpath] : handlers.notfound;

		var data = {
			'trimmedPath' : trimpath,
			'queryobject' : queryobject,
			'method' : method,
			'headers' : headers
		}

		//Route the request to handler specified in the router.

		chosenhandler(data, function(statuscode, payload) {
				//Use the status code callback , default to 200
				console.log("calling handler");

				statuscode = typeof(statuscode) == 'number'?statuscode:200;
				payload = typeof(payload) == 'object' ? payload : {};

				//convert to string 
				var payloadString = JSON.stringify(payload);
				res.setHeader('Content-Type', 'application/json')
				res.writeHead(statuscode);
				res.end(payloadString);
				console.log(trimpath +" "+method+" "+payloadString +" "+JSON.stringify(headers))
	
		});

		})
}



var handlers = {};
// Define Handler

handlers.ping = function(data, callback) {
	callback(200, {'name' : 'sample'});
}


handlers.notfound = function(data, callback) {
	callback(404);
}

// Define Router

var router = {
	'ping': handlers.ping
}
 
