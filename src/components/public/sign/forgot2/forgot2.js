var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.forgot2",{
			url: "/forgot/",
			templateUrl: "/templates/components/public/sign/forgot2/forgot2.html",
			controller: "Forgot2Controller"
		})
}); 

app.controller("Forgot2Controller", function ($scope) {

});