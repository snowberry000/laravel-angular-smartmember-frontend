var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.blog",{
			url: "/blog",
			templateUrl: "/templates/components/public/app/site/blog/blog.html",
			controller: "BlogController"
		})
}); 

app.controller( 'BlogController', function( $scope,$site, $rootScope, $localStorage, Restangular, notify )
{
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
	$scope.data = [];
	$scope.loading=true;
	$rootScope.page_title = "Blogs";
	$scope.template_data = {
		title: 'BLOG_POSTS',
		description: 'Posts are the informational material of your site that go in the blog.',
		singular: 'post',
		edit_route: 'public.administrate.site.content.blog.post',
		api_object: 'post'
	}
	$scope.paginate = function()
	{
			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };
			Restangular.all( '' ).customGET( 'post?view=admin&p=' + $params.p + '&site_id=' + $params.site_id).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
	}
	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate();
} );