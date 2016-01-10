var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.access", {
			url: "/access/:hash",
			controller: "AccessController"
		} )
} );

app.controller( 'AccessController', function( $scope, $rootScope, $location, notify, $localStorage, $stateParams, smModal,  Restangular )
{
	$scope.hash = '';

	if( $stateParams.hash )
	{
		$localStorage.hash = $stateParams.hash;

		if( $localStorage.user )
		{
            Restangular.all( 'user' ).customPOST( {hash: $localStorage.hash}, "associateHash" ).then( function( response )
            {
                $localStorage.hash = false;

	            /*if( $rootScope.app.subdomain == 'sm' )
	            {
		            window.location.href = 'http://my.smartmember.' + $rootScope.app.env;
	            }
	            else
	            {*/
		            location.href = '/';
	            //}

            } );
		}
		else
		{
			// They aren't logged in, so lets pop it up and let those controllers handle what to do with this hash
			smModal.Show('public.sign.up');
			console.log( "Showing sign up" );
		}
	}
} );