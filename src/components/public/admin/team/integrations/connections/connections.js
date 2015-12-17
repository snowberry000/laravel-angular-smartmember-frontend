var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integrations.connections",{
			url: "/connections",
			templateUrl: "/templates/components/public/admin/team/integrations/connections/connections.html",
			controller: "IntegrationsController"
		})
});