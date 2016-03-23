var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.tutorials", {
			url: "/tutorials",
			templateUrl: "/templates/components/admin/app/guide/tutorials/tutorials.html",
			controller: "AdminAppGuideTutorialsController"
		} )
} );

app.controller( "AdminAppGuideTutorialsController", function( $scope, $http, RestangularV3, Restangular, $rootScope )
{
	$http.get( 'json/tutorials.json' ).success( function( response )
	{
		$scope.tutorials = response.data;
	} );

} );