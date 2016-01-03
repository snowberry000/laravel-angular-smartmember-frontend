var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content.helpdesk",{
			url: "/helpdesk",
			templateUrl: "/templates/components/public/administrate/site/content/helpdesk/helpdesk.html",
			controller: "HelpdeskController"
		})
}); 

app.controller("HelpdeskController", function ($scope) {

});