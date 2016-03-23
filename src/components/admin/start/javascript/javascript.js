var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.javascript",{
			url: "/javascript",
			templateUrl: "/templates/components/admin/start/javascript/javascript.html",
			controller: "StartJavascriptController"
		})
}); 

app.controller("StartJavascriptController", function ($scope) {
	$scope.step1 = 'completed';
	$scope.step2 = 'active';
	$scope.step3 = '';
});