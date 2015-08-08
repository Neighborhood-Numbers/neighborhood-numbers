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

// {"area":"11","area_name":"Northeast","crm_cd":"901","crm_cd_desc":"VIOLATION OF RESTRAINING ORDER","cross_street":"   AVENUE 56","date_occ":"2014-07-27T00:00:00.000","date_rptd":"2014-07-29T00:00:00.000","dr_no":"141114215","location":"              MONTE VISTA","rd":"1137","status":"AO","status_desc":"Adult Other","time_occ":"1030"}
// ,{"area":"18","area_name":"Southeast","crm_cd":"310","crm_cd_desc":"BURGLARY","date_occ":"2014-07-26T00:00:00.000","date_rptd":"2014-07-26T00:00:00.000","dr_no":"141814495","location":" 1400      E  IMPERIAL","location_1":{"type":"Point","coordinates":[-118.2501,33.9295]},"rd":"1846","status":"IC","status_desc":"Invest Cont","time_occ":"0100"}
// ,{"area":"21","area_name":"Topanga","crm_cd":"997","crm_cd_desc":"TRAFFIC DR #","cross_street":"   SHOUP","date_occ":"2014-07-18T00:00:00.000","date_rptd":"2014-07-24T00:00:00.000","dr_no":"142113168","location":"              VICTORY","location_1":{"type":"Point","coordinates":[-118.6146,34.1865]},"rd":"2144","status":"IC","status_desc":"Invest Cont","time_occ":"2300"}
// ,{"area":"07","area_name":"Wilshire","crm_cd":"997","crm_cd_desc":"TRAFFIC DR #","cross_street":"   SATURN","date_occ":"2014-07-16T00:00:00.000","date_rptd":"2014-07-16T00:00:00.000","dr_no":"140711511","location":"              WEST                         BL","rd":"0785","status":"IC","status_desc":"Invest Cont","time_occ":"1740"}
// ,{"area":"11","area_name":"Northeast","crm_cd":"210","crm_cd_desc":"ROBBERY","cross_street":"   AVENUE 60","date_occ":"2014-07-15T00:00:00.000","date_rptd":"2014-07-15T00:00:00.000","dr_no":"141113434","location":"              FIGUEROA","rd":"1138","status":"IC","status_desc":"Invest Cont","time_occ":"1545"}
// ,{"area":"12","area_name":"77th Street","crm_cd":"210","crm_cd_desc":"ROBBERY","cross_street":"   VERMONT","date_occ":"2014-07-15T00:00:00.000","date_rptd":"2014-07-15T00:00:00.000","dr_no":"141216722","location":"              VERNON","location_1":{"type":"Point","coordinates":[-118.2937,34.0037]},"rd":"1204","status":"IC","status_desc":"Invest Cont","time_occ":"1920"}
// ,{"area":"04","area_name":"Hollenbeck","crm_cd":"997","crm_cd_desc":"TRAFFIC DR #","cross_street":"   PINECREST","date_occ":"2014-07-12T00:00:00.000","date_rptd":"2014-07-13T00:00:00.000","dr_no":"140411527","location":"              AVENUE 60","rd":"0404","status":"IC","status_desc":"Invest Cont","time_occ":"1000"}
// ,{"area":"18","area_name":"Southeast","crm_cd":"648","crm_cd_desc":"ARSON","cross_street":"   SAN PEDRO","date_occ":"2014-07-13T00:00:00.000","date_rptd":"2014-07-13T00:00:00.000","dr_no":"141813821","location":"              107TH","location_1":{"type":"Point","coordinates":[-118.2695,33.9393]},"rd":"1832","status":"IC","status_desc":"Invest Cont","time_occ":"0049"}
// ,{"area":"01","area_name":"Central","crm_cd":"997","crm_cd_desc":"TRAFFIC DR #","cross_street":"   GRAND","date_occ":"2014-07-11T00:00:00.000","date_rptd":"2014-07-12T00:00:00.000","dr_no":"140116393","location":"              OLYMPIC","location_1":{"type":"Point","coordinates":[-118.2606,34.043]},"rd":"0182","status":"IC","status_desc":"Invest Cont","time_occ":"2120"}
// ,{"area":"06","area_name":"Hollywood","crm_cd":"510","crm_cd_desc":"VEHICLE - STOLEN","date_occ":"2014-07-12T00:00:00.000","date_rptd":"2014-07-12T00:00:00.000","dr_no":"140615221","location":" 6500         LELAND                       WY","location_1":{"type":"Point","coordinates":[-118.3321,34.097]},"rd":"0666","status":"IC","status_desc":"Invest Cont","time_occ":"0030"}
// ,{"area":"11","area_name":"Northeast","crm_cd":"997","crm_cd_desc":"TRAFFIC DR #","date_occ":"2014-07-12T00:00:00.000","date_rptd":"2014-07-12T00:00:00.000","dr_no":"141113250","location":"  800      N  AVENUE 57","location_1":{"type":"Point","coordinates":[-118.1937,34.1189]},"rd":"1127","status":"IC","status_desc":"Invest Cont","time_occ":"0730"}
// ,{"area":"13","area_name":"Newton","crm_cd":"510","crm_cd_desc":"VEHICLE - STOLEN","cross_street":"   HOLMES","date_occ":"2014-07-12T00:00:00.000","date_rptd":"2014-07-12T00:00:00.000","dr_no":"141314425","location":"              55TH","location_1":{"type":"Point","coordinates":[-118.2411,33.993]},"rd":"1377","status":"IC","status_desc":"Invest Cont","time_occ":"0730"}
// ,{"area":"14","area_name":"Pacific","crm_cd":"210","crm_cd_desc":"ROBBERY","cross_street":"   BROOKS","date_occ":"2014-07-11T00:00:00.000","date_rptd":"2014-07-12T00:00:00.000","dr_no":"141418061","location":"              MAIN","location_1":{"type":"Point","coordinates":[-118.4741,33.9923]},"rd":"1412","status":"IC","status_desc":"Invest Cont","time_occ":"2130"}
// ,{"area":"07","area_name":"Wilshire","crm_cd":"210","crm_cd_desc":"ROBBERY","cross_street":"   WILSHIRE","date_occ":"2014-07-10T00:00:00.000","date_rptd":"2014-07-11T00:00:00.000","dr_no":"140711266","location":"              BURNSIDE","location_1":{"type":"Point","coordinates":[-118.3493,34.0624]},"rd":"0745","status":"JA","status_desc":"Juv Arrest","time_occ":"2300"}
// ,{"area":"03","area_name":"Southwest","crm_cd":"121","crm_cd_desc":"RAPE, FORCIBLE","cross_street":"   CRENSHAW","date_occ":"2014-07-02T00:00:00.000","date_rptd":"2014-07-09T00:00:00.000","dr_no":"140315313","location":"              VERNON","location_1":{"type":"Point","coordinates":[-118.3326,34.0033]},"rd":"0393","status":"IC","status_desc":"Invest Cont","time_occ":"0500"}


// var Crimes = sequelize.define('lacitycrimes', {
// 	area_num: Sequelize.STRING,
// 	area_name: Sequelize.STRING,
// 	crm_cd: Sequelize.STRING,
// 	crm_cd_desc: Sequelize.STRING,
// 	cross_street: Sequelize.STRING,
// 	date_occ: Sequelize.STRING,
// 	date_rptd: Sequelize.STRING,
// 	dr_no: Sequelize.STRING,
// 	location: Sequelize.STRING,
// 	location_1: Sequelize.ARRAY(Sequelize.DECIMAL),
// 	rd: Sequelize.STRING,
// 	status: Sequelize.STRING,
// 	status_desc: Sequelize.STRING,
// 	time_occ: Sequelize.STRING,
// });

// Crimes.sync({force: true}).then(function() {
// 	for (var i = 0; i < crimeinput.length; i++) {
// 		if (!crimeinput[i].location_1) {
// 			continue;
// 		}
// 		Crimes.create({
// 			area_num: crimeinput[i].area || "",
// 			area_name: crimeinput[i].area_name || "",
// 			crm_cd: crimeinput[i].crm_cd || "",
// 			crm_cd_desc: crimeinput[i].crm_cd_desc || "",
// 			cross_street: crimeinput[i].cross_street || "",
// 			date_occ: crimeinput[i].date_occ || "",
// 			date_rptd: crimeinput[i].date_rptd || "",
// 			dr_no: crimeinput[i].dr_no || "",
// 			location: crimeinput[i].location || "",
// 			location_1: crimeinput[i].location_1.coordinates || [0.0,0.0],
// 			rd: crimeinput[i].rd,
// 			status: crimeinput[i].status,
// 			status_desc: crimeinput[i].status_desc,
// 			time_occ: crimeinput[i].time_occ,
// 		})
// 	}
// })


 // app.use(parseString());
app.use(bodyparser.json());

// var User = sequelize.define('testname', {
//   username: Sequelize.STRING,
//   birthday: Sequelize.DATE
// });

// User.sync().then(function() {
// })


app.get('/data', function (req, res, next) {
	request('http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&address=845+Amoroso+Pl+&citystatezip=Venice%2C+CA', function (error, response, xml) {
		var $ = cheerio.load(xml);
		var xmlresponse = $('result');
		parseString(xmlresponse, function (err, result) {
			var firstget = {};
			firstget.state = result.result.address[0].state[0];
			firstget.city = result.result.address[0].city[0];
			firstget.neighborhood = result.result.localrealestate[0].region[0].$.name;
			request('http://www.zillow.com/webservice/GetDemographics.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&state='+ firstget.state + '&city=' + firstget.city + '&neighborhood=' + firstget.neighborhood, function (error, response, xml) {
				 var zillowdata = {};
				 var $ = cheerio.load(xml);
				 var xmlresponse = $('response')
		  		parseString(xmlresponse, function (err, result) {
			  	  zillowdata.state = result.response.region[0].state[0];
			  	  zillowdata.city = result.response.region[0].city[0];
		  	  	zillowdata.neighborhood = result.response.region[0].neighborhood[0];
			  	  var temp = result.response.pages[0].page[0].tables[0].table[0].data[0].attribute[0].values[0];
			  	  zillowdata.valueIndexNeighborhood = temp.neighborhood[0].value[0]._;
			  	  zillowdata.valueIndexCity = temp.city[0].value[0]._;
			  	  zillowdata.valueIndexNation = temp.nation[0].value[0]._;
			  	  temp = result.response.pages[0].page[1].tables[0].table[0].data[0];
			  	  if (temp.attribute[0].values[0].neighborhood !== undefined)
				  	  zillowdata.ownersNeighborhood = temp.attribute[0].values[0].neighborhood[0].value[0]._;
			  	  zillowdata.ownersIndexCity = temp.attribute[0].values[0].city[0].value[0]._;
			  	  zillowdata.ownersIndexNation = temp.attribute[0].values[0].nation[0].value[0]._;

		  	res.json(zillowdata);
				});
			});
		})
	})
});


app.listen(3000);