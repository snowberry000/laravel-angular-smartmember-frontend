var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.my", {
			url: "/",
			templateUrl: "/templates/components/public/my/my.html",
			controller: "MyController"
		} )
} );

app.controller( "MyController", function( $scope, toastr, $window, $rootScope, $state, $location, Restangular, $localStorage, smModal )
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
					smModal.Show( 'public.admin.wizard', { id: 'account_wizard', modal_options: {duration:0} } );
					console.log( "Lets do the setup wizard!" );
				}
				else
				{
					smModal.Show( 'public.admin.team.sites' );
				}

				//smModal.Show( 'public.admin.team.sites' );
			}
			else
			{
				smModal.Show( 'public.sign.in' );
			}
		}
	}, true );

	$rootScope.$watch( 'sites_loaded', function( new_value, old_value )
	{
		if( new_value && new_value != old_value )
		{
			if( $rootScope.sites.length > 1 )
			{
				// list of sites option
				//smModal.Show( 'public.admin.team.sites' );
			}
			/*
			 else{

			 if ($rootScope.sites.length == 1 && $rootScope.sites[0].subdomain == 'sm'){
			 smModal.Show( 'public.admin.wizard', {id: 'account_wizard', modal_options: {duration:0} } );
			 }

			 }
			 */
		}

	}, true );

	$scope.Init = function()
	{
		// Show something at least on pageload
		smModal.Show( 'public.sign.in', {modal_options: {duration:0}} );
	}

	$scope.Init();

} );