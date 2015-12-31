var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.membership.sharedaccesslevelkeys", {
			url: "/sharekeys",
			templateUrl: "/templates/components/public/admin/site/membership/sharedaccesslevelkeys/keys.html",
			controller: "ShareAccessLevelKeysController"
		} )
} );

app.controller( "ShareAccessLevelKeysController", function( $scope, $localStorage, smModal, $rootScope, Restangular, toastr )
{
	$scope.site = $site = $rootScope.site;
	$scope.template_data = {
		title: 'Shared Access Levels Keys',
		description: 'Associate your site to one or many shared access levels keys',
		singular: 'key',
		edit_route: 'public.admin.site.membership.sharedaccesslevelkey',
		api_object: 'accessLevelShareKey'
	}

	$scope.data = [];
	$scope.pagination = { current_page: 1 };
	$scope.pagination.total_count = 1;

	$scope.paginate = function()
	{
		if( typeof $scope.data[ $scope.pagination.current_page ] != 'object' )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}
			Restangular.all( '' ).customGET( 'sharedKey/associatedKey?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
		}
	}

	$scope.paginate();

	$scope.search = function()
	{
		$scope.loading = true;
		$scope.data = [];
		$scope.pagination = { current_page: 1 };
		var $params = { site_id: $site.id, p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}

	$scope.afterDelete = function(id){

		if(id){
			var itemWithId = _.find( $scope.data[ $scope.pagination.current_page ], function( next_item )
			{
				return next_item.id === id;
			} );

			itemWithId.remove().then( function()
			{
				$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], itemWithId );
			} );
		}
		
	}

	$scope.delete = function( id )
	{
		smModal.Show('public.app.delete' , {route : 'accessLevel' , id : id} , null , $scope.afterDelete);
		/*
		var modalInstance = $modal.open( {
			templateUrl: 'templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			var itemWithId = _.find( $scope.data[ $scope.pagination.current_page ], function( next_item )
			{
				return next_item.id === id;
			} );

			itemWithId.remove().then( function()
			{
				$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], itemWithId );
			} );
		} )*/
	};

	$scope.copied = function()
	{
		toastr.success( "Link copied!" );
	}
} );