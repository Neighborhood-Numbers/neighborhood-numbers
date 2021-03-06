angular.module('main')//FACTORIES AND SERVICES!
.controller('MapController', MapController);

MapController.$inject = ['$rootScope', '$http'];
function MapController($rootScope, $http) {
  var that = this;
  var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a521y3ytjf_728x4&address=';

  $rootScope.address = this.address;
  this.hospitals = [];
  this.schools = [];
  this.crimes = [];
  
  this.lookup = function() {
    that.placeMarker();

    that.address;
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
          radius: 5000,
          query: 'hospital'
        };
        var request2 = {
          location: results[0].geometry.location,
          radius: 5000,
          query: 'school'
        } 

        //find local hospitals and put markers 
        service.textSearch(request1, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < 3; i++) {
              var place = results[i];
              that.hospitals.push(place);
              var placeLoc = place.geometry.location;
              var image = {
                url: '../../assets/hospital-building.png'
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
              that.schools.push(place);
              var placeLoc = place.geometry.location;
              var image = {
                url: '../../assets/school-2.png'
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
          for (var i = 0; i < data.length; i ++) {
            console.log(data[i].location_1);
            var position = new google.maps.LatLng(data[i].location_2, data[i].location_1);
            var desc = data[i].crm_cd_desc;

            //displays unique marker for the type of crime
            if (desc === 'identity_theft') {
              var url = 'http://www.google.com/intl/en_ALL/mapfiles/marker.png';
            } 
            else if (desc === 'theft_burglary') {
              var url = 'http://i.stack.imgur.com/nHP5J.jpg';
            }
            else if (desc === 'sexcrimes') {
              var url = 'https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=%E2%80%A2';
            }
            else if (desc === 'stolen_vehicle') {
              var url = 'http://i.stack.imgur.com/nHP5J.jpg';
            }
            else if (desc === 'assault_battery') {
              var url = 'http://i.stack.imgur.com/nHP5J.jpg';
            }
            else if (desc === 'vandalism') {
              var url = 'http://i.stack.imgur.com/nHP5J.jpg';
            }
            else if (desc === 'othercrimes') {
              var url = 'http://i.stack.imgur.com/nHP5J.jpg';
            }
            var image = {
              url: url
            }
            var marker = new google.maps.Marker({
              map: map,
              position: position,
              icon: image
            })
            var obj = {
              Crime: desc
            }
            that.crimes.push(obj);
          }
        });
      }
    });
  }
}
