var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.account.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/administrate/account/settings/settings.html",
			controller: "AccountController"
		})
}); 
