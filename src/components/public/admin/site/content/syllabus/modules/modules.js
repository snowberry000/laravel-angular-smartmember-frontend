var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.content.syllabus.modules", {
			url: "/modules",
			templateUrl: "/templates/components/public/admin/site/content/syllabus/modules/modules.html",
			controller: "ModulesController"
		} )
} );

app.controller( "ModulesController", function( $scope, $rootScope, $localStorage, $state, $stateParams,  $filter, Restangular, toastr )
{
	$site = $rootScope.site;
	$scope.template_data = {
		title: 'MODULES',
		description: 'Modules let you group together lessons - think "sections" or "chapters".',
		singular: 'module',
		edit_route: 'public.admin.site.content.syllabus.module',
		api_object: 'module'
	}

	$scope.data = [];
	$scope.pagination = { current_page: 1 };
	$scope.pagination.total_count = 1;

	$scope.paginate = function()
	{

		if( typeof $scope.data[ $scope.pagination.current_page ] != 'object' )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $rootScope.site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
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

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

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
			return next_item.id === id;
		} );

		itemWithId.remove().then( function()
		{
			$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], itemWithId );
		} );
	};
} );