var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "wallboard", {
			url: "/wallboard",
			templateUrl: "/templates/components/wallboard/wallboard.html",
			controller: "WallboardController",

		} )
} );

app.controller( "WallboardController", function($rootScope, $scope, Restangular, $state )
{
	$rootScope.is_wallboard = true;
	$scope.wallboard = {};
	Restangular.one('site','details')
		.get()
		.then(function(response){
			$site = response;
			$rootScope.site = $site;

            if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'view_financial_stats' ) == -1 )
                $state.go('public.app.site.home');

			if( !$site.is_admin )
			{
				$state.go( 'public.administrate.account.memberships' );
				return;
			}

			
			$scope.loading = true;
		})

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