var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.smart-links",{
			url: "/smart-links",
			templateUrl: "/templates/components/public/administrate/smart-links/smart-links.html",
			controller: "Smart-linksController"
		})
});