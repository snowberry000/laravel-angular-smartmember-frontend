var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.account.profile",{
			url: "/profile",
			templateUrl: "/templates/components/admin/account/profile/profile.html"
		})
}); 
