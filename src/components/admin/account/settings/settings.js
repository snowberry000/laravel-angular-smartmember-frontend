var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.account.settings",{
			url: "/settings",
			templateUrl: "/templates/components/admin/account/settings/settings.html"
		})
}); 
