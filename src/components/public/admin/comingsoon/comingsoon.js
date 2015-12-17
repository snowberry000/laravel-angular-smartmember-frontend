var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.comingsoon",{
			url: "/comingsoon",
			templateUrl: "/templates/components/public/admin/comingsoon/comingsoon.html",
			controller: "ComingsoonController"
		})
}); 

app.controller("ComingsoonController", function ($scope) {

});