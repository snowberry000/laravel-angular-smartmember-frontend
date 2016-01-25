var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.apps.app_configurations",{
			url: "/app_configurations",
			templateUrl: "/templates/components/public/app/admin/apps/app_configurations/app_configurations.html",
			controller: "app_configurationsController"
		})
}); 