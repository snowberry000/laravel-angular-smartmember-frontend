var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.in",{
			url: "/in/:hash?",
			templateUrl: "/templates/components/public/sign/in/in.html"
		})
}); 

app.controller("InController", function ($scope) {

});