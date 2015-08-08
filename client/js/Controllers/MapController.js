angular.module('main')

.controller('MapController', MapController);

MapController.$inject = ['$rootScope', '$http'];

function MapController($rootScope, $http) {
  var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&address=';
  $rootScope.address = this.address;
  var that = this;
  this.lookup = function() {
    var pos = this.placeMarker();
    //845 Amoroso Pl, Venice, CA
    // that.address = '2114 Bigelow Ave, Seattle, WA';
    this.getURL();
  }

  this.placeMarker = function () {
    //Get the geocode of our address
    var GeoJson = {address: that.address};
    var pos;
    //Place the marker of the address on our map
    geocoder.geocode(GeoJson, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          label: "H"
        });
        pos = results[0].geometry.location;
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }); return pos;
  }

this.getURL = function () {
  //split the address input by commas
  var strArr = that.address.split(',');
  street = strArr[0];
  city = strArr[1].trim();
  state = strArr[2].trim();

  strAddress = street.split(' ');
    //create string to append to url and loop through street address array to the street values
    var str = '';
    for (var i = 0; i < strAddress.length; i ++) {
      if (i === strAddress.length - 1) {
        str += strAddress[i] + '&citystatezip=' + city + '%2C+' + state;
        break;
      }
      str = str + strAddress[i] + '+';
    } 
    url += str; 
    that.url = url;
  }
};
// function getPlaces(position) {
//   var Json = {
//     key: 'AIzaSyDvzb0OWTF0DNjkalsD7bTtqldwmNvOftE',
//     location: position,
//     radius: 10000,
// }