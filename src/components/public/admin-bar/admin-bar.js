var app = angular.module( "app" );

app.controller( 'AdminBarController', function( $scope, $rootScope, $localStorage, $state, $stateParams, $modal, $filter, Restangular, toastr, $location )
{
	$scope.loading_sites = true;
    //Restangular.one( 'company/getUsersSitesAndTeams' ).get().then( function(response){
     //   console.log('we have data admin data: ', response.admin );
      //  console.log('we have data membership data: ', response.member );
    //});

    /* not sure if you need any of this
    Restangular.all( 'site' ).customGET( 'members' ).then( function( response )
	{
		console.log( "The Response: ", response );

	} );
    */
} );