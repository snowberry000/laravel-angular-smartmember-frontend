var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.wallboard", {
			url: "/wallboard",
			templateUrl: "/templates/components/public/administrate/wallboard/wallboard.html",
			controller: "WallboardController",

		} )
} );

app.controller( "WallboardController", function($rootScope, $scope, Restangular )
{
	$site = $rootScope.site;

	if( !$site.is_admin )
	{
		$state.go( 'public.administrate.account.memberships' );
		return;
	}

	$scope.wallboard = {};
	$scope.loading = true;

	$scope.refreshData = function()
	{
		Restangular.all( 'transaction' ).customGET( 'summary' ).then( function( response )
		{
			$scope.wallboard = response;
			$scope.loading = false;
		} );
	}

	$scope.refreshData();

	var data_fetch = setInterval( function()
	{
		$scope.refreshData();
	}, 30000 );
} );