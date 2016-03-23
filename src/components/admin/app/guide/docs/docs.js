var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.docs", {
			url: "/docs",
			templateUrl: "/templates/components/admin/app/guide/docs/docs.html",
			controller: "AdminAppGuideDocsController"
		} )
} );

app.controller( "AdminAppGuideDocsController", function( $scope, $http, RestangularV3, Restangular, $rootScope )
{


} );