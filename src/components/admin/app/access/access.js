var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.access", {
			url: "/access",
			redirectTo: 'admin.app.access.doors',
			templateUrl: "/templates/components/admin/app/access/access.html",
			controller: "AccessController"
		} )
} );

app.controller( "AccessController", function( $scope, Restangular, $rootScope, $stateParams, $state, smMembers, $http,$timeout )
{	
   $rootScope.page_title = "Access";
});