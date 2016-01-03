var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.account.photo",{
			url: "/photo",
			templateUrl: "/templates/components/public/administrate/account/photo/photo.html"
		})
}); 
