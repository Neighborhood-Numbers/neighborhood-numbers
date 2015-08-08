"use strict";
angular.module('main', ['uiGmapgoogle-maps'])

.config(function(uiGmapGoogleMapApiProvider) {
 
 uiGmapGoogleMapApiProvider.configure({
  key: 'AIzaSyDvzb0OWTF0DNjkalsD7bTtqldwmNvOftE',
  v: '3.17',
  libraries: 'weather,geometry,visualization',
  sensor: false
 
 });
})

.controller("GMap", GMap) 

function GMap($rootScope, $scope, uiGmapGoogleMapApi) {
  
  // Define variables for our Map object
  var areaLat      = 33.9794709,
      areaLng      = -118.422549,
      areaZoom     = 10;

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.GMap     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom };
    $scope.options = { scrollwheel: false };
  });

};