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
			// Since they're already logged in, we should send this hash incase it needs to "do" something
			console.log( "logged in, submitting hash" );

			// $user =
			//Restangular.all( '' ).customGET( 'user/transactionAccess/' + $stateParams.hash ).then( function( response )
			//{
			//	location.href = location.href.substr( 0, location.href.indexOf( '?' ) );
			//} );
		}
		else
		{
			// They aren't logged in, so lets pop it up and let those controllers handle what to do with this hash
			smModal.Show('public.sign.up');
			console.log( "Showing sign up" );
		}
	}
} );