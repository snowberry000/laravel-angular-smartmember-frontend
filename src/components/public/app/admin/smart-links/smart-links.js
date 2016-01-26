var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.smart-links",{
			url: "/smart-links",
			templateUrl: "/templates/components/public/app/admin/smart-links/smart-links.html",
			controller: "SmartLinksController"
		})
});

app.controller( 'SmartLinksController', function( $scope )
{

} );
