var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integrations.available",{
			url: "/available",
			templateUrl: "/templates/components/public/admin/team/integrations/available/available.html",
			controller: "IntegrationsController"
		})
}); 