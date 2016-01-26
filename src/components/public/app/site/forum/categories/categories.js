var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.site.forum.categories", {
			url: "/forum",
			templateUrl: "/templates/components/public/app/site/forum/categories/categories.html",
			controller: "CategoriesController"
		} )
} );

app.controller( "CategoriesController", function( $scope, $rootScope,Restangular )
{
	$scope.loading = true;

	$rootScope.page_title = $rootScope.site.name+' - Forum';
	$scope.categories = false;
	$scope.category = {};

	Restangular.service( 'forumCategory' )
		.getList()
		.then( function( response )
		{
			$scope.categories = response;

			$scope.loading = false;
		} );

} );