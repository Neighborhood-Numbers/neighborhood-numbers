var http = require('http');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var spotcrime = require('spotcrime');
var Sequelize = require('sequelize');

// var sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'postgres',

//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   },

// });

// // Or you can simply use a connection uri
// var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

app.get('/data', function (req, res, next) {
	var loc = {
	  lat: 33.39657,
	  lon: -118.03422
	};
	 
	var radius = 0.1; // this is miles 
	 
	spotcrime.getCrimes(loc, radius, function(err, crimes){
		if (err) {
			console.log('err');
			console.log(err);
		}
		else {
	  	console.log(crimes);
	  }
	});
})


app.listen(3000);