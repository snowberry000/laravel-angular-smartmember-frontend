var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.login",{
			url: "/login",
			templateUrl: "/templates/components/public/login/login.html",
			controller: "signController"
		})
}); 

app.controller("LoginController", function ($scope) {

});