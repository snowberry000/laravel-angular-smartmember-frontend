var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.team.site", {
			url: "/site/:id?",
			templateUrl: "/templates/components/public/admin/team/site/site.html",
			controller: "SiteController"
		} )
} );

app.controller( 'SiteController', function( $scope, toastr, $stateParams , $rootScope, $state, smModal,$localStorage, $location, Restangular, notify )
{
	if($stateParams.id){
		Restangular.one('site' , $stateParams.id).then(function(response){
			$scope.site = response;
		})
	}
	$scope.save = function()
	{
		$scope.saving = true;
		if( $scope.site.id )
		{
			$scope.update();
			return;
		}
		$scope.create();
	}

	$scope.clone_sites = Restangular.all( 'site' ).getList( { cloneable: 1 } );
	//$scope.site = $rootScope.site;
	$scope.site = {};
	$scope.changeSite = function( id )
	{
		$scope.current_clone_site = _.find( $clone_sites, { id: id } );
	}
	$scope.update = function()
	{
		$scope.site.put().then( function( response )
		{
			toastr.success( "Site Edited!" );
			smModal.Show("admin.team.sites");
		}, function( response )
		{
			$scope.saving = false;
		} )
	}

	$scope.create = function()
	{
		Restangular.service( "site" ).post( $scope.site ).then( function( response )
		{

			toastr.success( "Site Created!" );

			var domainParts = $location.host().split( '.' );
			var env = domainParts.pop();//dev
			var domain = domainParts.pop() + "." + env;
			if( domain.indexOf( 'smartmember' ) == -1 )
			{
				domain = 'smartmember.com';
			}

			window.location.href = "http://" + response.subdomain + '.' + domain + "/admin/site/dashboard";
		}, function( response )
		{
			$scope.saving = false;
		} );
	}
} );

