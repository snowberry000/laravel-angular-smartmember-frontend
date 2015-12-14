var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integration",{
			url: "/integration/:integration",
			templateUrl: "/templates/components/admin/team/integration/integration.html",
			controller: "IntegrationsController"
		})
}); 