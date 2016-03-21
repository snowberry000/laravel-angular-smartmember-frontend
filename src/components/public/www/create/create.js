var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.create",{
			url: "/create",
			templateUrl: "/templates/components/public/www/create/create.html",
			controller: "PublicWWWCreateController"
		})
}); 

app.controller("PublicWWWCreateController", function ($scope) {

});