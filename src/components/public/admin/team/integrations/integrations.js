var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.app_configurations",{
			url: "/app_configurations",
			templateUrl: "/templates/components/public/admin/team/app_configurations/app_configurations.html",
			controller: "app_configurationsController"
		})
}); 