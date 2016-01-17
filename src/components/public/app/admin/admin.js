var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin",{
			url: "/admin",
			sticky: true,
			abstract: true,
			views: {
				'admin': {
					templateUrl: "/templates/components/public/app/admin/admin.html",
					controller: "AppAdminController"
				}
			},
			resolve: {


			}
		})
}); 

app.controller("AppAdminController", function ( $scope ) {

});