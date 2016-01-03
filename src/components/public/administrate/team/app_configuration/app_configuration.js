var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.integration",{
			url: "/integration/:integration",
			templateUrl: "/templates/components/public/administrate/team/app_configuration/app_configuration.html",
			controller: "app_configurationsController"
		})
}); 