var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.forum.categories", {
			url: "/categories",
			templateUrl: "/templates/components/public/app/forum/categories/categories.html",
			controller: "CategoriesController"
		} )
} );

app.controller( "CategoriesController", function( $scope, Restangular )
{


	$scope.categories = false;
	$scope.category = {};

	Restangular.service( 'forumCategory' )
		.getList()
		.then( function( response )
		{
			$scope.categories = response;
		} );

} );