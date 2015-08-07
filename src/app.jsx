var React = require('react');

App = React.createClass({
  map: null,
  marker: null,
  infoWindow: null,
  render: function() {
    return (
      <div className="GMap">
        <div ref="map_canvas">
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.map = this.createMap();
    this.marker = this.createMarker();
    this.infoWindow = this.createInfoWindow();
    google.maps.event.addListener(this.map, 'zoom_changed', (function(_this) {
      return function() {
        return _this.handleZoomChange();
      };
    })(this));
    return google.maps.event.addListener(this.map, 'dragend', (function(_this) {
      return function() {
        return _this.handleDragEnd();
      };
    })(this));
  },
  createMap: function() {
    var coords, mapOptions;
    coords = this.props.coords;
    mapOptions = {
      minZoom: 9,
      zoom: 10,
      center: new google.maps.LatLng(this.props.coords.lat, this.props.coords.lon)
    };
    return new google.maps.Map(this.refs.map_canvas.getDOMNode(), mapOptions);
  },
  createMarker: function() {
    var marker;
    return marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.props.coords.lat, this.props.coords.lon),
      map: this.map
    });
  },
  createInfoWindow: function() {
    var contentString, infoWindow;
    contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>";
    return infoWindow = new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    });
  },
  handleZoomChange: function() {},
  handleDragEnd: function() {}
});

React.render(<App />,
    document.body);