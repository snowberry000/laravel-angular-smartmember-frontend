var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.app_configurations.list",{
			url: "/list",
			templateUrl: "/templates/components/public/administrate/team/app_configurations/list/list.html",
			controller: "app_configurationsController"
		})
});