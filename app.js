var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require("path");
var express = require('express');
var app = express();

dbclient = mysql.createConnection({
<<<<<<< HEAD
  host: "bernarville.mysql.rds.aliyuncs.com",
  user: "kingston",
  password: "cjd123456",
  database: "zblibrary"
=======
	host: "bernarville.mysql.rds.aliyuncs.com",
	user: "kingston",
	password: "cjd123456",
	database: "zblibrary"
>>>>>>> e27ec56729def78f832899b7cf6ed882856f512e
});

app.use(bodyParser());

app.get("/", function(req, res) {
	var realpath = __dirname + "/public/main.html";
	res.sendFile(realpath);
});

app.get('*.*', function(req, res) {
	var realpath = __dirname + req.url;
	res.sendFile(realpath);
});

app.post("/show", function(req, res) {
<<<<<<< HEAD
  var queryString = "";
  queryString = 'SELECT square FROM zbl WHERE py="' + req.body.py +'" ORDER BY code';
  dbclient.query(queryString, function(err, results, fields) {
    //console.log(results);
    res.send(results);
  });
});
=======
	var queryString = "";
	queryString = 'SELECT square FROM zbl WHERE py="' + req.body.py + '" ORDER BY code';
	dbclient.query(queryString, function(err, results, fields) {
		//console.log(results);
		res.send(results);
	});
})
>>>>>>> e27ec56729def78f832899b7cf6ed882856f512e

dbclient.connect(function(err, results) {
	console.log("mysql has started");
});

var server = app.listen(2333, function() {
	console.log("Server has started.");
})
