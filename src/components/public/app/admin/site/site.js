var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.site", {
			url: "/site/:id?",
			templateUrl: "/templates/components/public/app/admin/site/site.html",
			controller: "SiteController"
		} )
} );

app.controller( 'SiteController', function( $scope, toastr, $stateParams, RestangularV3, $rootScope, $state,$localStorage, $location, Restangular, $filter , smMembers)
{
	if( $stateParams.id )
	{
		Restangular.one( 'site', $stateParams.id ).then( function( response )
		{
			$scope.site = response;
		} )
	}
	$scope.save = function()
	{
		$scope.saving = true;
		if($scope.site && !($scope.site.subdomain || $scope.site.domain)){
			toastr.error('Please enter a domain or a subdomain');
			return;
		}
		if( $scope.site.id )
		{
			$scope.update();
			return;
		}
		$scope.create();
	}

	$scope.setSubdomain = function( $event )
	{
		if( !$scope.site.subdomain )
		{
			$scope.site.subdomain = $filter( 'urlify' )( $scope.site.name );
		}
	}

	Restangular.all( '' ).customGET( 'site?cloneable=1' ).then( function( response )
	{
		$scope.clone_sites = response.sites;
		$scope.clone_sites_dfy = response.dfy_sites;
	} );
	//$scope.site = $rootScope.site;
	$scope.site = {};
	$scope.changeSite = function( id )
	{
		$scope.current_clone_site = _.findWhere( $scope.clone_sites, { id: parseInt(id) } );
		if ($scope.current_clone_site == undefined)
		{
			$scope.current_clone_site = _.findWhere( $scope.clone_sites_dfy, { id:  parseInt(id) } );
		}
	}
	$scope.update = function()
	{
		$scope.site.put().then( function( response )
		{
			toastr.success( "Site Edited!" );
			$state.go('public.app.admin.sites');
		}, function( response )
		{
			$scope.saving = false;
		} )
	}

	$scope.create = function()
	{
		Restangular.service( "site" ).post( $scope.site ).then( function( response )
		{
            smMembers.IncrementResponseAttribute( 'sites_created', response );

			toastr.success( "Site Created!" );

			var domainParts = $location.host().split( '.' );
			var env = domainParts.pop();//dev
			var domain = domainParts.pop() + "." + env;
			if( domain.indexOf( 'smartmember' ) == -1 )
			{
				domain = 'smartmember.com';
			}

			window.location.href = "http://" + response.subdomain + '.' + domain + '?new';
		}, function( response )
		{
			$scope.saving = false;
		} );

		RestangularV3.all('auth').customPOST({site : $scope.site , user : $localStorage.user} , 'replicateuser').then(function(response){
			console.log(response);
		})
	}
} );

