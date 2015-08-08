function initialize() {
  var mapOptions = {
    center: { lat: 33.9794709, lng: -118.422549},
    zoom: 10
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);