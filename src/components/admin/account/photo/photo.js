var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.account.photo",{
			url: "/photo",
			templateUrl: "/templates/components/admin/account/photo/photo.html"
		})
}); 
