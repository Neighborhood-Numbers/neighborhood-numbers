function initialize() {//MAP should be service instead of global variable. Try Angular Google Maps Api
  var mapOptions = {
    center: { lat: 33.9794709, lng: -118.422549},
    zoom: 10
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  geocoder = new google.maps.Geocoder();
  service = new google.maps.places.PlacesService(map);
};

google.maps.event.addDomListener(window, 'load', initialize);