var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.comingsoon",{
			url: "/comingsoon",
			templateUrl: "/templates/components/public/administrate/comingsoon/comingsoon.html",
			controller: "ComingsoonController"
		})
}); 

app.controller("ComingsoonController", function ($scope) {

});