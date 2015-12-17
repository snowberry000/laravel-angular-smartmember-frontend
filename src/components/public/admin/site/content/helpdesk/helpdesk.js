var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.content.helpdesk",{
			url: "/helpdesk",
			templateUrl: "/templates/components/public/admin/site/content/helpdesk/helpdesk.html",
			controller: "HelpdeskController"
		})
}); 

app.controller("HelpdeskController", function ($scope) {

});