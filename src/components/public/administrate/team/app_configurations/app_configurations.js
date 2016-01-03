var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.app_configurations",{
			url: "/app_configurations",
			templateUrl: "/templates/components/public/administrate/team/app_configurations/app_configurations.html",
			controller: "app_configurationsController"
		})
}); 