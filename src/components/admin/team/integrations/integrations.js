var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations",{
			url: "/integrations",
			templateUrl: "/templates/components/admin/team/integrations/integrations.html",
			controller: "IntegrationsController"
		})
}); 