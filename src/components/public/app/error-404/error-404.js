var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.error-404",{
			url: "/not-found",
			templateUrl: "/templates/components/public/app/error-404/error-404.html",
			controller: "Error-404Controller"
		})
}); 

app.controller("Error-404Controller", function ($scope,$rootScope) {
	$rootScope.page_title = 'Error-404';

});