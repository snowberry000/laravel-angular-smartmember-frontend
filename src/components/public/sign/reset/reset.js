var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.reset",{
			url: "/reset/:hash",
			templateUrl: "/templates/components/public/sign/reset/reset.html",
			controller: "resetController"
		})
}); 

app.controller("ResetController", function ($scope) {

});