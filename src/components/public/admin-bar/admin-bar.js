var app = angular.module( "app" );

app.controller( 'AdminBarController', function( $scope, $rootScope, $localStorage, $state, $stateParams, $modal, $filter, Restangular, toastr, $location )
{
	$scope.loading_sites = true;

	Restangular.all( 'site' ).customGET( 'members' ).then( function( response )
	{
		console.log( "The Response: ", response );

	} );

} );