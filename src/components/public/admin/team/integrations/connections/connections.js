var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.app_configurations.connections",{
			url: "/connections",
			templateUrl: "/templates/components/public/admin/team/app_configurations/connections/connections.html",
			controller: "app_configurationsController"
		})
});