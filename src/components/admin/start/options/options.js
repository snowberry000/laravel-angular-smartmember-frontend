var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.options",{
			url: "/options",
			templateUrl: "/templates/components/admin/start/options/options.html",
			controller: "StartOptionsController"
		})
}); 

app.controller("StartOptionsController", function ($scope , Start , $location , $rootScope , RestangularV3) {
	$scope.step1 = 'active';
	$scope.step2 = '';
	$scope.step3 = '';

	$scope.email = $location.search().email;
	Start.validate($scope.email);
	
});