var app = angular.module( "app" );

app.controller( 'AdminBarController', function( $scope, $rootScope, $localStorage, $state, $stateParams, $modal, $filter, Restangular, toastr, $location )
{
	$scope.loading_sites = true;
    Restangular.one( 'company/getUsersSitesAndTeams' ).get().then( function(response){
        console.log('we have data admin data: ', response.admin );
        console.log('we have data membership data: ', response.member );
    });

    /* not sure if you need any of this
    Restangular.all( 'site' ).customGET( 'members' ).then( function( response )
	{
		console.log( "The Response: ", response );

		$sites = response;
		$scope.loading = false;
		$scope.adminPagination.total_count = $sites.admin.count;
		$sites.admin = $sites.admin.sites;
		$sites.member = $sites.member.sites;


		angular.forEach( $sites.admin, function( site, key )
		{
			site.data = {};
			angular.forEach( site.meta_data, function( data, key )
			{
				site.data[ data.key ] = data.value;
			} );
			site.is_site_admin = $scope.isAdmin( $user.role, site );
			site.is_team_member = $scope.isTeamMember( $user.role, site );
			site.is_agent = $scope.isAgent( $user.role, site );
			site.role_name = $scope.setRoleName( site );
		} );

		angular.forEach( $sites.member, function( site, key )
		{
			site.data = {};

			angular.forEach( site.meta_data, function( data, key )
			{
				site.data[ data.key ] = data.value;
			} );

			site.is_agent = $scope.isAgent( $user.role, site );
			site.is_site_admin = $scope.isAdmin( $user.role, site );

		} );

		$scope.sites = $sites;
		$scope.sites_loaded = true;
		$scope.adminSites[ $scope.adminPagination.current_page ] = $sites.admin;
		$scope.memberSites[ $scope.adminPagination.current_page ] = $sites.member;
		var isMemberTraining = _.find( $sites.member, { 'subdomain': 'training' } );
		var isAdminTraining = _.find( $sites.admin, { 'subdomain': 'training' } );
		$scope.can_see_sites = isMemberTraining || isAdminTraining || (($sites.admin) && ($sites.admin.length > 0));
		$scope.can_add_sites = isMemberTraining || isAdminTraining;
		$scope.is_customer = isMemberTraining || isAdminTraining;

		//  || $sites.admin.length > 0
		if( ($scope.is_customer) && $state.current.name != 'admin.account.memberships' )
		{
			$state.go( "admin.team.sites" );
		}
		else if( $state.current.name != 'admin.team.sites' )
		{
			$state.go( "admin.account.memberships" )
		}
		$rootScope.can_add_sites = $scope.can_add_sites;

		$scope.sites = $sites;
	} );
    */
} );