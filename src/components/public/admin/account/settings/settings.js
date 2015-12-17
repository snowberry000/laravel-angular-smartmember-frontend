var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.account.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/admin/account/settings/settings.html"
		})
}); 
