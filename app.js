var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require("path");
var express = require('express');
var app = express();

dbclient = mysql.createConnection({
	host: "bernarville.mysql.rds.aliyuncs.com",
	user: "kingston",
	password: "cjd123456",
	database: "zblibrary"
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
	var queryString = "";
	queryString = 'SELECT square FROM zbl WHERE py="' + req.body.py + '" ORDER BY code';
	dbclient.query(queryString, function(err, results, fields) {
		//console.log(results);
		res.send(results);
	});
});

dbclient.connect(function(err, results) {
	console.log("mysql has started");
});

var server = app.listen(2333, function() {
	console.log("Server has started.");
})
