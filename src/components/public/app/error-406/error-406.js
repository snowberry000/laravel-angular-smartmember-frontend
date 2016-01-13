var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.error-406",{
			url: "/domain-not-found",
			templateUrl: "/templates/components/public/app/error-406/error-406.html",
			controller: "Error-406Controller"
		})
}); 

app.controller("Error-406Controller", function ($scope,$rootScope) {
	$rootScope.page_title  = $rootScope.site.name+' - Error-406';

});