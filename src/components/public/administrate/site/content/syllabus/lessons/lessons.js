var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.content.syllabus.lessons", {
			url: "/lessons",
			templateUrl: "/templates/components/public/administrate/site/content/syllabus/lessons/lessons.html",
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
		edit_route: 'public.administrate.site.content.syllabus.lesson',
		api_object: 'lesson'
	}

	$scope.loading = false;
	$scope.query = '';
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
			$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			$scope.addAccessLevel($scope.data);
		} );
	}

	$scope.paginate();

	$scope.addAccessLevel = function(data){
		if(!data || !data.length)
			return;
		$.each(data, function (key, data) {
		    switch(parseInt(data.access_level_type)){
		        case 1:
		            data.access = 'Public';
		            break;
		        case 2:
		            data.access = data.access_level !== undefined && data.access_level !== null && data.access_level.name !== undefined ? data.access_level.name : '';
		            break;
		        case 3:
		            data.access = 'Members';
		            break;
		        case 4:
		            data.access = 'Draft (admin-only)';
		            break;
		    }
		});
	}

	$scope.deleteResource = function( id )
	{
		var itemWithId = _.find( $scope.data, function( next_item )
		{
			return next_item.id == id;
		} );

		itemWithId.remove().then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
			$state.transitionTo($state.current, $stateParams, { 
          reload: true, inherit: false, location: false
        });
		} );
	};
} );