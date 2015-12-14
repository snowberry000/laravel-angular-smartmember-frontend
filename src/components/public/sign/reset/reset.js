var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.reset",{
			url: "/reset/:hash",
			templateUrl: "/templates/components/public/sign/reset/reset.html"
		})
}); 

app.controller("ResetController", function ($scope) {

});