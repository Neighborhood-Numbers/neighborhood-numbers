var http = require('http');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var spotcrime = require('spotcrime');
var Sequelize = require('sequelize');
sequelize = new Sequelize('cool', 'testuser', '1234', {
	dialect: 'postgres',
	host: 'localhost',
	port: 5432
})

var Crimes = sequelize.define('lacitycrimes', {
	area_num: Sequelize.STRING,
	area_name: Sequelize.STRING,
	crm_cd: Sequelize.STRING,
	crm_cd_desc: Sequelize.STRING,
	cross_street: Sequelize.STRING,
	date_occ: Sequelize.DATE,
	date_rptd: Sequelize.DATE,
	dr_no: Sequelize.STRING,
	location: Sequelize.STRING,
	location_1: Sequelize.ARRAY(Sequelize.DECIMAL),
	rd: Sequelize.STRING,
	status: Sequelize.STRING,
	status_desc: Sequelize.STRING,
	time_occ: Sequelize.STRING,
});

Crimes.sync().then(function() {
})

app.use(bodyparser.json());

var User = sequelize.define('testname', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

User.sync().then(function() {
})
// Or you can simply use a connection uri
// var sequelize = new Sequelize('postgres://testuser:1234@localhost:5432/cool', function (err, stuff) {
// 	if (!err) {
// 		console.log('success?');
// 	}
// });

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