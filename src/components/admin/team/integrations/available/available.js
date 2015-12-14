var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations.available",{
			url: "/available",
			templateUrl: "/templates/components/admin/team/integrations/available/available.html",
			controller: "IntegrationsController"
		})
}); 