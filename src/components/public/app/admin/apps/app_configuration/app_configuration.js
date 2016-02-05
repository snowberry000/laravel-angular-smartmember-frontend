var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.apps.integration",{
			url: "/integration/:integration",
			templateUrl: "/templates/components/public/app/admin/apps/app_configuration/app_configuration.html",
			controller: "app_configurationsController"
		})
}); 