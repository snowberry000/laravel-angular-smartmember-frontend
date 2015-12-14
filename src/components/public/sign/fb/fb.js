var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.fb",{
			url: "/fb",
			templateUrl: "/templates/components/public/sign/fb/fb.html",
			controller: "FbController"
		})
}); 

app.controller("FbController", function ($scope) {

});