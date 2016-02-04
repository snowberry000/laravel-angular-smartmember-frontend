var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.downloads", {
			url: "/downloads",
			templateUrl: "/templates/components/public/app/admin/downloads/downloads.html",
			controller: "DownloadsController"
		} )
} );

app.controller( "DownloadsController", function( $scope, $rootScope, smModal, $timeout, $localStorage, $state, $stateParams, Restangular, toastr, $filter )
{
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');

	$scope.template_data = {
		title: 'DOWNLOADS',
		description: 'Provided downloadable photos, files, media, and more',
		singular: 'download',
		edit_route: 'public.app.admin.download',
		api_object: 'download'
	}
	$scope.site = $site = $rootScope.site;
	$scope.data = [];
		$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate = function(search)
	{
		if (search)
		{
			$scope.pagination.current_page = 1;
		}

		if( true )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
			{
				$scope.loading = false;

				if( !data )
				{
					$scope.data = [];
				}
				else
				{
					$scope.pagination.total_count = data.total_count;
					$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
				}
			} );
		}
	}

	$scope.paginate();

	$scope.search = function()
	{
		$scope.loading = true;
		$scope.data = [];
		$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
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
		var itemWithId = _.find( $scope.data, function( next_item )
		{
			return next_item.id == parseInt(id);
		} );

		itemWithId.remove().then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
			$state.transitionTo( $state.current, $state.params, {
				reload: true, inherit: false, location: false
			} );
			// $timeout(function(){
			// 	$state.transitionTo( $state.current, $state.params, {
			// 	reload: true, inherit: false, location: false
			// } );
			// } , 50)
		} );
	};

} );