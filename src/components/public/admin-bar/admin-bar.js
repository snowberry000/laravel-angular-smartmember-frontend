var app = angular.module( "app" );

app.controller( 'AdminBarController', function( $scope, $rootScope, $localStorage, $state, $stateParams, $filter, Restangular, toastr, $location )
{
	$scope.loading_sites = true;
	Restangular.one( 'company/getUsersSitesAndTeams' ).get().then( function( response )
	{
		$scope.loading_sites = false;

		$scope.admin_sites = [];//response.admin;
		$scope.member_sites = [];//response.member;

		$.each( response.admin, function( key, value )
		{
			if( value && value.sites )
			{
				$.each( value.sites, function( key2, value2 )
				{
					$scope.admin_sites.push( value2 );
				} );
			}
		} );

		$.each( response.member, function( key, value )
		{
			if( value && value.sites )
			{
				$.each( value.sites, function( key2, value2 )
				{
					$scope.member_sites.push( value2 );
				} );
			}
		} );


		console.log( 'we have data admin data: ', response.admin );
		console.log( 'we have data membership data: ', response.member );
	} );

	$scope.selectFirstSite = function(event){
		if (event.which == 13){
			
		}
		
	}

} );