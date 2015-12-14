var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.up",{
			url: "/up/:hash?",
			templateUrl: "/templates/components/public/sign/up/up.html"
		})
}); 

app.controller("UpController", function ($scope) {

});