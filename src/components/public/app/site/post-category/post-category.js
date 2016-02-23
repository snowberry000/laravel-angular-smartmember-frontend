var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.post-category",{
			url: "/blog/:permalink",
			templateUrl: "/templates/components/public/app/site/post-category/post-category.html",
			controller: "PostCategoryController",
            reloadOnSearch: false
		})
}); 

app.controller( 'PostCategoryController', function( $scope,$site, $rootScope, $localStorage, $stateParams, Restangular, notify )
{
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
	$scope.data = [];

    $scope.loading = true;

    $rootScope.page_title = "Blog Category";

	$scope.template_data = {
		title: 'Blog Category',
		description: 'Posts are the informational material of your site that go in the blog.',
		singular: 'post',
		edit_route: 'public.app.admin.post',
		api_object: 'post'
	}

	$scope.paginate = function()
	{
        $scope.loading = true;

        var $params = {
            p: $scope.pagination.current_page,
            site_id: $site.id,
            permalink: $stateParams.permalink
        };

        Restangular.all( '' ).customGET( 'post?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + '&permalink=' + $params.permalink ).then( function( data )
        {
            $scope.loading = false;
            $scope.pagination.total_count = data.total_count;
            $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            $scope.category = data.category;

            $rootScope.widget_target_type = 'category';
            $rootScope.widget_target = $scope.category.id;
        } );
	}
	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );
	if ($scope.site.blog_format != undefined || $scope.site.blog_format != '')
	{
		$scope.blog_format = $scope.site.blog_format;
	} else {
		$scope.blog_format = 'thumbnail';
	}

	$scope.showFormat = function(format) {
		$scope.blog_format = format;
	}
	$scope.paginate();
} );