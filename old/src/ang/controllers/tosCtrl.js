app.controller('TOSController', function ($scope, $rootScope, $location, $state, $modal, Restangular) {
	$rootScope.is_landing = false;
	$rootScope.full_bleed = true;

	$scope.current_domain = $location.protocol() + "://" + $location.host();

});