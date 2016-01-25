var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.apps.integration.choose",{
			url: "/choose",
			templateUrl: "/templates/components/public/app/admin/apps/app_configuration/choose/choose.html",
			controller: "app_configurationsController"
		})
}); 