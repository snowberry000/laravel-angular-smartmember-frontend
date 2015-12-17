var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.account.profile",{
			url: "/profile",
			templateUrl: "/templates/components/public/admin/account/profile/profile.html"
		})
}); 
