var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integration",{
			url: "/integration/:integration",
			templateUrl: "/templates/components/public/admin/team/integration/integration.html",
			controller: "app_configurationsController"
		})
}); 