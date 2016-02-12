var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.my", {
			url: "/",
			views: {
				'base': {
					templateUrl: "/templates/components/public/my/my.html",
					controller: "MyController",
				},
				'extra': {
					template: ""
				}
			},
			resolve: {
			}
		} )
} );

app.controller( "MyController", function( $scope, toastr, $window, $rootScope, $state, $location, Restangular, $localStorage )
{
	$rootScope.$watch( 'user_loaded', function( new_value, old_value )
	{
		console.log( 'user_loaded changed to ', new_value, ' from ', old_value );

		if( new_value && new_value != old_value )
		{
			if( $rootScope.user && $rootScope.user.id )
			{
				// user has loaded, so lets show a modal even if it's not ready yet and will be redirected away, just so
				// it feels better.
				// Here is where we should be able to tell on the user variable if it should show the wizard or not

				if( $rootScope.user.sm_access && !$rootScope.user.setup_wizard_complete )
				{
					$state.go( 'public.app.admin.wizard.list', { id: 'account_wizard'} );
					console.log( "Lets do the setup wizard!" );
				}
				else
				{
					$state.go( 'public.app.admin.sites' );
				}
			}
			else
			{
				$state.go( 'public.sign.in' );
			}
		}

		console.log( "Init 3" );

	}, true );

	$rootScope.$watch( 'sites_loaded', function( new_value, old_value )
	{
		if( new_value && new_value != old_value )
		{
		}

		console.log( "Init 2" );

	}, true );

	$scope.Init = function()
	{
		// Show something at least on pageload
		if(!$localStorage.user || !$localStorage.user.access_token)
		{
			$state.go( 'public.sign.in' );
		}
		else
		{

			console.log( "Guess I'm logged in" );
		}

		console.log( "Init 1" );
			
	}

	

} );