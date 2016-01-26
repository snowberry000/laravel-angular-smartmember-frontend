var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.support", {
			url: "/support",
			templateUrl: "/templates/components/public/app/admin/support/support.html",
			controller: "AdminSupportController"
		} )
} );

app.controller( "AdminSupportController", function( $scope, $rootScope, $localStorage, $state, Restangular, notify )
{
} );