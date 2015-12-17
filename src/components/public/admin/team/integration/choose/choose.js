var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integration.choose",{
			url: "/choose",
			templateUrl: "/templates/components/public/admin/team/integration/choose/choose.html",
			controller: "IntegrationsController"
		})
}); 