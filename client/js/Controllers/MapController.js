angular.module('main')

	.controller('MapController', ['$rootScope', MapController);

function MapController() {
	$rootScope.address = this.address;
	//this.lookup = function() {

	// }
]});