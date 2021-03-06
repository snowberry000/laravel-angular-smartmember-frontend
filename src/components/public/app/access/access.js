var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.site.access", {
			url: "/access/:hash",
			controller: "AccessController"
		} )
} );

app.controller( 'AccessController', function( $scope, $rootScope, $location, notify, $localStorage, $stateParams, $state,  Restangular )
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

	            if( !location.host.isCustomDomain() && $rootScope.app.subdomain == 'sm' )
	            {
		            window.location.href = 'http://my.smartmember.' + $rootScope.app.env;
	            }
	            else
	            {
		            location.href = '/';
	            }

            } );
		}
		else
		{
			// They aren't logged in, so lets pop it up and let those controllers handle what to do with this hash
			$localStorage.access_pass_redirect = true;
			$state.go('public.sign.up');
		}
	}
} );