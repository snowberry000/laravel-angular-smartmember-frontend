var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.team.sites", {
			url: "/sites",
			templateUrl: "/templates/components/public/admin/team/sites/sites.html",
			controller: "SitesController"
		} )
} );

app.controller( "SitesController", function( $scope, $rootScope, $localStorage, toastr, $location, Restangular, $state, notify )
{
	$scope.can_create_sites = true; //TODO: fix this to use proper SM customer detection

	$scope.domain = $location.host().split( "." ).splice( -2, 1 ).pop();
	$scope.isCollapsed = false;
	$scope.env = $scope.app.env;

	$scope.iter = 0;

	$scope.sites = [];

	$scope.deleteSite = function( site )
	{
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return site.id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			Restangular.one( 'site', site.id ).remove().then( function()
			{
				$scope.sites = _.without( $scope.sites, site );
				toastr.success( "Site deleted successfully!" );
			} );
		} )
	};

	$scope.loadMore = function()
	{
		console.log( "doing loadMore" );

		for( var i = 1; i <= 20; i++ )
		{
			console.log( '$rootScope.sites.length', $rootScope.sites.length );
			console.log( '$scope.iter', $scope.iter, $scope.sites );

			if( $rootScope.sites.length > $scope.iter )
			{
				$scope.sites.push( $rootScope.sites[ $scope.iter ] );
				$scope.iter++;
			}
		}
	};

	$scope.search = function()
	{

		$scope.loading = true;
		$scope.adminSites = [];
		$scope.memberSites = [];
		$scope.currentPage = 1;
		$scope.adminPagination = { current_page: 1 };
		$scope.adminPagination.total_count = 1;

		Restangular.all( 'site' ).customGET( 'members?p=' + ($scope.adminPagination.current_page) + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( response )
		{
			$scope.loading = false;
			$sites = response;
			$scope.adminPagination.total_count = $sites.admin.count;
			$sites.admin = $sites.admin.sites;
			$sites.member = $sites.member.sites;
			// if(response.admin.length>0 || response.member.length>0)
			//     $scope.disable = false;

			angular.forEach( $sites.admin, function( site, key )
			{
				site.data = {};
				angular.forEach( site.meta_data, function( data, key )
				{
					site.data[ data.key ] = data.value;
				} );
			} );

			angular.forEach( $sites.member, function( site, key )
			{
				site.data = {};

				angular.forEach( site.meta_data, function( data, key )
				{
					site.data[ data.key ] = data.value;
				} );

				site.is_agent = $scope.isAgent( $user.role );

			} );
			$scope.sites.admin = $scope.sites.admin.concat( $sites.admin );
			console.log( $scope.sites.admin.length )
			$scope.sites.member = $scope.sites.member.concat( $sites.member );
			$scope.adminSites[ $scope.adminPagination.current_page ] = $sites.admin;
			$scope.memberSites[ $scope.adminPagination.current_page ] = $sites.member;
		} );
	}

	$scope.$on('$destroy', function() {
        alert("In destroy");
        $( "body *" ).unbind( 'scroll' );
    });
} );