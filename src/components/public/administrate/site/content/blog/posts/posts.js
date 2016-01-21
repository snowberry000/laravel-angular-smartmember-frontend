var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.content.blog.posts", {
			url: "/posts",
			templateUrl: "/templates/components/public/administrate/site/content/blog/posts/posts.html",
			controller: "PostsController"
		} )
} );

app.controller( "PostsController", function( $scope, $rootScope, $localStorage, $state, $stateParams,  $filter, Restangular, toastr )
{
	$scope.template_data = {
		title: 'BLOG_POSTS',
		description: 'Posts are the informational material of your site that go in the blog.',
		singular: 'post',
		edit_route: 'public.administrate.site.content.blog.post',
		api_object: 'post'
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

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
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

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
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

		
			var itemWithId = _.find( $scope.data, function( next_item )
			{
				return next_item.id === parseInt(id);
			} );

			itemWithId.remove().then( function()
			{
				$scope.data = _.without( $scope.data, itemWithId );
				$setTimeout(
								function() {$state.transitionTo($state.current, $state.params, { 
					          reload: true, inherit: false, location: false
					        });}, 50);
			} );
	};
} );