var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.account",{
			url: "/account",
			redirectTo: 'admin.start.account.options',
			templateUrl: "/templates/components/admin/start/account/account.html",
			controller: "StartAccountController"
		})
}); 

app.controller("StartAccountController", function ($scope , $location) {
	$scope.step1 = 'completed';
	$scope.step2 = 'completed';
	$scope.step3 = 'active';

	$scope.email = $location.search().email;
});