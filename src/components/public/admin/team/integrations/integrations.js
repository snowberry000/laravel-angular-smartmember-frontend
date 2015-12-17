var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integrations",{
			url: "/integrations",
			templateUrl: "/templates/components/public/admin/team/integrations/integrations.html",
			controller: "IntegrationsController"
		})
}); 