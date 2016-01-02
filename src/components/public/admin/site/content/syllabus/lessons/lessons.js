var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.content.syllabus.lessons", {
			url: "/lessons",
			templateUrl: "/templates/components/public/admin/site/content/syllabus/lessons/lessons.html",
			controller: "AdminLessonsController"
		} )
} );

app.controller( "AdminLessonsController", function( $scope, $rootScope, $localStorage, $state, $stateParams, $filter, Restangular, toastr )
{
	$site = $rootScope.site;
	$scope.template_data = {
		title: 'LESSONS',
		description: 'Add lessons to your site for members to read / watch / hear.',
		singular: 'lesson',
		edit_route: 'public.admin.site.content.syllabus.lesson',
		api_object: 'lesson'
	}

	$scope.loading = false;
	$scope.query = '';
	$scope.data = [];
	$scope.pagination = { current_page: 1, per_page: 10, total_count: 0 };

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	});

	$scope.paginate = function()
	{
		$scope.loading = true;

		var $params = { p: $scope.pagination.current_page, site_id: $rootScope.site.id };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
		{
			$scope.loading = false;
			$scope.pagination.total_count = data.total_count;
			$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
		} );
	}

	$scope.paginate();

	$scope.deleteResource = function( id )
	{
		var itemWithId = _.find( $scope.data[ $scope.pagination.current_page ], function( next_item )
		{
			return next_item.id == id;
		} );

		itemWithId.remove().then( function()
		{
			$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], itemWithId );
		} );
	};
} );