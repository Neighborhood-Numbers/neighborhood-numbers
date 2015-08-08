angular.module('main')
.config(function(uiGmapGoogleMapApiProvider) {
 
 uiGmapGoogleMapApiProvider.configure({
  key: 'AIzaSyDvzb0OWTF0DNjkalsD7bTtqldwmNvOftE',
  v: '3.17',
  libraries: 'weather,geometry,visualization',
  sensor: false
 
 });
})

.controller('MapController', MapController);

MapController.$inject = ['$rootScope', '$http'];

function MapController($rootScope, $http, uiGmapGoogleMapApi) {
  var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&address=';
	$rootScope.address = this.address;
  var that = this;
	this.lookup = function() {
    var GeoJson = {address: that.address};
    var Geocoder = uiGmapGoogleMapApi.Geocoder;
    Geocoder.geocode(GeoJson).success(function(results, status) {
      console.log(results);
    })

    // // that.address = '2114 Bigelow Ave, Seattle, WA';
    // //split the address input by commas
    // var strArr = that.address.split(',');
    // street = strArr[0];
    // city = strArr[1].trim();
    // state = strArr[2].trim();

    // strAddress = street.split(' ');
    // //create string to append to url and loop through street address array to the street values
    // var str = '';
    // for (var i = 0; i < strAddress.length; i ++) {
    //   if (i === strAddress.length - 1) {
    //     str += strAddress[i] + '&citystatezip=' + city + '%2C+' + state;
    //     break;
    //   }
    //   str = str + strAddress[i] + '+';
    // } 
    // url += str; 
    // that.url = url;
	}


};