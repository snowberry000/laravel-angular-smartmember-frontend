var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.forgot",{
			url: "/forgot",
			templateUrl: "/templates/components/public/sign/forgot/forgot.html",
			controller : 'resetController'
		})
}); 

app.controller("ForgotController", function ($scope) {

});