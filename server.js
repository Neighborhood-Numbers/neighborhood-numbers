var http = require('http');
var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var bodyparser = require('body-parser');
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
	date_occ: Sequelize.STRING,
	date_rptd: Sequelize.STRING,
	dr_no: Sequelize.STRING,
	location: Sequelize.STRING,
	location_1: Sequelize.REAL,
	location_2: Sequelize.REAL,
	rd: Sequelize.STRING,
	status: Sequelize.STRING,
	status_desc: Sequelize.STRING,
	time_occ: Sequelize.STRING,
});



 // app.use(parseString());
app.use(bodyparser.json());


app.get('/stuff', function (req, res, next) {
	var inputlat = 34.02;
	var inputlon = -118.25;
	var lat = [inputlat - .015, inputlat + .015];
	var lon = [inputlon - .017, inputlon + .017];
	Crimes.findAll({
		where: {
			location_1: { 
				$between: lon
			},
			location_2: {
				$between: lat
			}
		},
		attributes: ['crm_cd_desc', 'location_1', 'location_2']
	}).done(function(stuff) { res.json(stuff)})
})


app.get('/data', function (req, res, next) {
	request('http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&address=845+Amoroso+Pl+&citystatezip=Venice%2C+CA', function (error, response, xml) {
		var $ = cheerio.load(xml);
		var xmlresponse = $('result');
		parseString(xmlresponse, function (err, result) {
			var firstget = {};
			firstget.state = result.result.address[0].state[0];
			firstget.city = result.result.address[0].city[0];
			firstget.neighborhood = result.result.localrealestate[0].region[0].$.name;
			// console.log(firstget);
			request('http://www.zillow.com/webservice/GetDemographics.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&state='+ firstget.state + '&city=' + firstget.city + '&neighborhood=' + firstget.neighborhood, function (error, response, xml) {
				 var zillowdata = {};
				 var $ = cheerio.load(xml);
				 var xmlresponse = $('response')
				 zillowdata.state = xmlresponse.find('region').find('state').text();
				 zillowdata.city = xmlresponse.find('region').find('city').text();
				 zillowdata.neighborhood = xmlresponse.find('region').find('neighborhood').text();
				 zillowdata.valueIndex = {};
				 var temp = xmlresponse.find('pages').children('page').find('name').text('Affordability').next().find('tables').find('table').find('data');
				 // console.log(temp);
				 var temp2 = temp.children('data').find('name').text('Affordability Data').next().find('values');
				 console.log(temp2);
				 zillowdata.valueIndex.neighborhood = temp2.find('neighborhood').find('value').text();
				 zillowdata.valueIndex.city = temp2.find('city').find('value').text();
				 
		  		// parseString(xmlresponse, function (err, result) {
			  	//   zillowdata.state = result.response.region[0].state[0];
			  	//   zillowdata.city = result.response.region[0].city[0];
			  	//   zillowdata.neighborhood = result.response.region[0].neighborhood[0];
			  	//   var temp = result.response.pages[0].page[0].tables[0].table[0].data[0].attribute[0].values[0];
			  	//   zillowdata.valueIndex = {};
			  	//   zillowdata.valueIndex.Neighborhood = temp.neighborhood[0].value[0]._;
			  	//   zillowdata.valueIndex.City = temp.city[0].value[0]._;
			  	//   zillowdata.valueIndex.Nation = temp.nation[0].value[0]._;
			  	//   temp = result.response.pages[0].page[1].tables[0].table[0].data[0];
			  	//   console.log(temp.attribute[0]);
			  	//   zillowdata.owners = {};
			  	//   if (temp.attribute[0].values[0].neighborhood) {
			  	//   	zillowdata.owners.Neighborhood = temp.attribute[0].values[0].neighborhood[0].value[0]._
			  	//   };
			  	//   zillowdata.owners.City = temp.attribute[0].values[0].city[0].value[0]._;
			  	//   zillowdata.owners.Nation = temp.attribute[0].values[0].nation[0].value[0]._;
			  	//   zillowdata.renters = {};
			  	//   if (temp.attribute[1].values[0].neighborhood) {
			  	//   	zillowdata.renters.Neighborhood = temp.attribute[1].values[0].neighborhood[0].value[0]._
			  	//   };
			  	//   zillowdata.renters.City = temp.attribute[1].values[0].city[0].value[0]._;
			  	//   zillowdata.renters.Nation = temp.attribute[1].values[0].nation[0].value[0]._;
			  	//   zillowdata.sqft = {};
			  	//   zillowdata.sqft.Neighborhood = temp.attribute[2].values[0].neighborhood[0].value[0]._;
			  	//   zillowdata.sqft.City = temp.attribute[2].values[0].city[0].value[0]._;
			  	//   temp = result.response.pages[0].page[1].tables[0].table[0].data[0].attribute;
			  	//   zillowdata.medianHouseholdIncome = {};
			  	//   // zillowdata.medianHouseholdIncome.Neighborhood = temp[0].values[0].neighborhood[0].value[0]._;
			  	//   zillowdata.medianHouseholdIncome.City = temp[0].values[0].city[0].value[0]._;
			  	//   zillowdata.medianHouseholdIncome.Nation = temp[0].values[0].nation[0].value[0]._;
			  	//   zillowdata.singleMales = {};
			  	//   // zillowdata.singleMales.Neighborhood = temp[1].values[0].neighborhood[0].value[0]._;
			  	//   zillowdata.singleMales.City = temp[1].values[0].city[0].value[0]._;
			  	//   zillowdata.singleMales.Nation = temp[1].values[0].nation[0].value[0]._;
			  	//   zillowdata.singleFemales = {};
			  	//   // zillowdata.singleFemales.Neighborhood = temp[2].values[0].neighborhood[0].value[0]._;
			  	//   zillowdata.singleFemales.City = temp[2].values[0].city[0].value[0]._;
			  	//   // zillowdata.singleFemales.Nation = temp[2].values[0].nation[0].value[0]._;
			  	//   zillowdata.medianAge = {};
			  	//   if (temp[3].values[0].neighborhood) {
			  	//   	zillowdata.medianAge.Neighborhood = temp[3].values[0].neighborhood[0].value[0]._;
			  	// 	}
			  	//   zillowdata.medianAge.City = temp[3].values[0].city[0].value[0]._;
			  	//   // zillowdata.medianAge.Nation = temp[3].values[0].nation[0].value[0]._;

		  		  res.json(zillowdata);
				// });
			});
		})
	})
});


app.listen(3000);