angular.module('main')

	.controller('MapController', MapController);

MapController.$inject = ['$rootScope'];

function MapController($rootScope) {
	$rootScope.address = this.address;
	//this.lookup = function() {

	// }
};