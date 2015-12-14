var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.comingsoon",{
			url: "/comingsoon",
			templateUrl: "/templates/components/admin/comingsoon/comingsoon.html",
			controller: "ComingsoonController"
		})
}); 

app.controller("ComingsoonController", function ($scope) {

});