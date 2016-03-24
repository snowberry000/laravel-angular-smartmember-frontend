var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.account.options",{
			url: "/options",
			templateUrl: "/templates/components/admin/start/account/options/options.html",
			controller: "StartAccountOptionsController"
		})
}); 

app.controller("StartAccountOptionsController", function ($scope) {
	$scope.step1 = 'active';
	$scope.step2 = '';
	$scope.step3 = '';
});