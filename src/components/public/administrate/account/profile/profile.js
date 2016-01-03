var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.account.profile",{
			url: "/profile",
			templateUrl: "/templates/components/public/administrate/account/profile/profile.html"
		})
}); 
