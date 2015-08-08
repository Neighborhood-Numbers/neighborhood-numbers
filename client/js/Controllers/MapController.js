angular.module('main')

.controller('MapController', MapController);

MapController.$inject = ['$rootScope', '$http'];

function MapController($rootScope, $http) {
  var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&address=';
  $rootScope.address = this.address;
  var that = this;
  this.lookup = function() {
    that.placeMarker();
    //845 Amoroso Pl, Venice, CA
    // that.address = '2114 Bigelow Ave, Seattle, WA';
    that.getURL();
    that.getPlaces();
    that.getCrime();
  }

  this.placeMarker = function () {
    //Get the geocode of our address
    var GeoJson = {address: that.address};
    
    //Place the marker of the address on our map
    geocoder.geocode(GeoJson, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(14);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          label: "H"
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }); 
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

  this.getPlaces = function() {

    var GeoJson = {address: that.address};
    //Get geocode of location
    geocoder.geocode(GeoJson, function(results, status) {
      //if geocode returns, create the request objects
      if (status == google.maps.GeocoderStatus.OK) {
        var request1 = {
          location: results[0].geometry.location,
          radius: 1000,
          query: 'hospital'
        };
        var request2 = {
          location: results[0].geometry.location,
          radius: 1000,
          query: 'school'
        } 
        //find local hospitals and put markers 
        service.textSearch(request1, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < 3; i++) {
              var place = results[i];
              var placeLoc = place.geometry.location;
              var image = {
                url: './hospital-building.png'
              }
              var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: image
              });
            }
          }
        });
        //find local schools and put markers
        service.textSearch(request2, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < 3; i++) {
              var place = results[i];
              var placeLoc = place.geometry.location;
              var image = {
                url: './school-2.png'
              }
              var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: image
              });
            }
          }
        });
      }
      else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });  
  }

  this.getCrime = function() {
    //Get the geocode of our address
    var GeoJson = {address: that.address};
    
    //Place the marker of the address on our map
    geocoder.geocode(GeoJson, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var location = results[0].geometry.location;
        $http.post('/address', location).success(function(data) {
          console.log(data);
        });
      }
    });
  }
}
// function getPlaces(position) {
//   var Json = {
//     key: 'AIzaSyDvzb0OWTF0DNjkalsD7bTtqldwmNvOftE',
//     location: position,
//     radius: 10000,
// }

