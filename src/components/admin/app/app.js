var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app", {
			redirectTo: 'admin.app.smart-sites.list',
			views: {
				'base': {
					templateUrl: "/templates/components/admin/app/app.html",
					controller: "AppController",
				},
				'extra': {
					template: ""
				}
			},
			resolve: {}
		} )
} );

app.controller( "AppController", function( $scope, toastr, $window, $rootScope, $state, $location, Restangular, $localStorage, smModal )
{
	$rootScope.show_tutorial = false;
	$scope.grid_classes = '';

	// var a = new SM("1");
	// a.login("/auth/companylogin","cashflowchampion@gmail.com" , "hello123" , function(data){
	// 	alert(data);
	// } , function(data){
	// 	alert("error");
	// 	alert(data);
	// });
	
	$scope.SetGridClasses = function( next_value )
	{
		$scope.grid_classes = next_value;
	};
	
	$scope.GetAdminBarInclude = function()
	{
		var state = $state.current.name.split( '.' );
		if( state.length >= 3 )
		{
			state = state[ 2 ];
		}

		if( $state.includes( 'public.www' ) || $state.includes( 'admin.app.start' ) )
		{
			return;
		}

		if( $scope.isLoggedIn() )
		{
			return 'templates/components/admin/app/admin-bar/admin-bar.html';
		}

		return;
	};

	$scope.ChangePreviewViewport = function( desired_size )
	{
		$scope.preview_viewport_size = desired_size;
	};

	$scope.GetPreviewViewport = function()
	{
		return $scope.preview_viewport_size || 'desktop';
	}

	$rootScope.$watch( 'user_loaded', function( new_value, old_value )
	{
		console.log( 'user_loaded changed to ', new_value, ' from ', old_value );

		if( new_value && new_value != old_value )
		{
			if( $rootScope.user && ($rootScope.user.id || $rootScope.user._id) )
			{
				// user has loaded, so lets show a modal even if it's not ready yet and will be redirected away, just so
				// it feels better.
				// Here is where we should be able to tell on the user variable if it should show the wizard or not

				if( $rootScope.user.sm_access && !$rootScope.user.setup_wizard_complete )
				{
					$state.go( 'admin.app.wizard', { id: 'account_wizard' } );
					console.log( "Lets do the setup wizard!" );
				}
				else
				{
					//$state.go( 'admin.app.members' );
				}
			}
			else
			{
				$state.go( 'admin.sign.in' );
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
		if( !$localStorage.user || !$localStorage.user.access_token )
		{
			$state.go( 'admin.sign.in' );
		}
		else
		{

			console.log( "Guess I'm logged in" );
		}

		console.log( "Init 1" );

	}

	$scope.switchCompany = function()
	{
		smModal.Show( "admin.app.select-site" );
	}

} );