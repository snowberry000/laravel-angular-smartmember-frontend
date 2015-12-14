var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integration.choose",{
			url: "/choose",
			templateUrl: "/templates/components/admin/team/integration/choose/choose.html",
			controller: "IntegrationsController"
		})
}); 