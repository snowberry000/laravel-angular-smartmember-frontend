var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www",{
			url: "/",
			templateUrl: "/templates/components/public/www/www.html",
			controller: "WwwController"
		})
}); 

app.controller("WwwController", function ($scope) {

});