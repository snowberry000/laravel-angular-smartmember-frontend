var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.smart-links.create",{
			url: "/create/:id?",
			templateUrl: "/templates/components/public/administrate/smart-links/create/create.html",
			controller: "SmartLinksCreateController"
		})
}); 

app.controller("SmartLinksCreateController", function ($scope) {

});