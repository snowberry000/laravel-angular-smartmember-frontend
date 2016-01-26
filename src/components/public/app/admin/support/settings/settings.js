var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.support.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/app/admin/support/settings/settings.html"
		})
}); 