var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin",{
			url: "/admin",
			templateUrl: "/templates/components/public/admin/admin.html",
			controller: "PublicAdminController"
		})
}); 

app.controller("PublicAdminController", function ($scope) {

});