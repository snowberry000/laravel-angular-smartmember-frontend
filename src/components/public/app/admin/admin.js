var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin",{
			url: "/admin",
			templateUrl: "/templates/components/public/app/admin/admin.html",
			controller: "PublicAdminController",
			resolve: {


			}
		})
}); 

app.controller("PublicAdminController", function ( $scope ) {

});