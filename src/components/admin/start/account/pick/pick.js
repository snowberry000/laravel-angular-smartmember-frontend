var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.account.pick",{
			url: "/pick",
			templateUrl: "/templates/components/admin/start/account/pick/pick.html",
			controller: "StartAccountPickController"
		})
}); 

app.controller("StartAccountPickController", function ($scope) {
	$scope.step1 = 'active';
	$scope.step2 = '';
	$scope.step3 = '';
});