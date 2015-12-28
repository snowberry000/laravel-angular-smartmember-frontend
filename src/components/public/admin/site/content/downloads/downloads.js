var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.content.downloads", {
			url: "/downloads",
			templateUrl: "/templates/components/public/admin/site/content/downloads/downloads.html",
			controller: "DownloadsController"
		} )
} );

app.controller( "DownloadsController", function( $scope, $rootScope, smModal, $localStorage, $state, $stateParams, Restangular, toastr, $filter )
{
	$scope.template_data = {
		title: 'DOWNLOADS',
		description: 'Provided downloadable photos, files, media, and more',
		singular: 'download',
		edit_route: 'public.admin.site.content.download',
		api_object: 'download'
	}
	$scope.site = $site = $rootScope.site;
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

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
			{
				$scope.loading = false;

				if( !data )
				{
					$scope.data = [];
				}
				else
				{
					$scope.pagination.total_count = data.length;
					$scope.data[ $scope.pagination.current_page ] = data;
				}
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

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
		{
			if( !data )
			{
				$scope.data = [];
			}
			else
			{
				$scope.pagination.total_count = data.total_count;
				$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			}

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}

	$scope.deleteResource = function( id )
	{
		var itemWithId = _.find( $scope.data[ $scope.pagination.current_page ], function( next_item )
		{
			return next_item.id == parseInt(id);
		} );

		itemWithId.remove().then( function()
		{
			$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], itemWithId );
		} );
	};

} );