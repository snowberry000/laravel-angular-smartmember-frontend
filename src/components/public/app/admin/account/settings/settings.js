var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.account.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/app/admin/account/settings/settings.html",
			controller: "AccountController"
		})
}); 
