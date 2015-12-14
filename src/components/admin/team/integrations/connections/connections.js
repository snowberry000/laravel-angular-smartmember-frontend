var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations.connections",{
			url: "/connections",
			templateUrl: "/templates/components/admin/team/integrations/connections/connections.html",
			controller: "IntegrationsController"
		})
});