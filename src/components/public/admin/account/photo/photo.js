var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.account.photo",{
			url: "/photo",
			templateUrl: "/templates/components/public/admin/account/photo/photo.html"
		})
}); 
