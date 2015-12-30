var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integration",{
			url: "/integration/:integration",
			templateUrl: "/templates/components/public/admin/team/app_configuration/app_configuration.html",
			controller: "app_configurationsController"
		})
}); 