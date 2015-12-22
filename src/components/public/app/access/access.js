var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.access", {
			url: "/access/:hash",
			templateUrl: "/templates/components/public/app/access/access.html",
			controller: "AccessController"
		} )
} );

app.controller( 'AccessController', function( $scope, $rootScope, $location, notify, $localStorage, $stateParams, smModal,  Restangular )
{
	$scope.hash = '';
	$user = $rootScope.user;

	if( $stateParams.hash )
	{
		$localStorage.hash = $stateParams.hash;

		if( $user )
		{
            Restangular.all( 'user' ).customPOST( {hash: $localStorage.hash}, "associateHash" ).then( function( response )
            {
                $localStorage.hash = false;
                location.href = '/';
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