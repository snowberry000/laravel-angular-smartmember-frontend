var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.in2",{
			url: "/in",
			templateUrl: "/templates/components/public/sign/in2/in2.html",
			controller: "signController"
		})
}); 

app.controller("In2Controller", function ($scope) {

});