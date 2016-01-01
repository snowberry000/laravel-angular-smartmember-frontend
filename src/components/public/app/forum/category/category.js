var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.forum.category", {
			url: "/forum/:permalink",
			templateUrl: "/templates/components/public/app/forum/category/category.html",
			controller: "Forum-categoryController"
		} )
} );


app.controller( "Forum-categoryController", function( $scope, $rootScope, $stateParams, Restangular )
{
	Restangular.one( 'forumCategory', 'permalink' )
		.get( { permalink: $stateParams.permalink } )
		.then( function( response )
		{
			$scope.category = response;
			$rootScope.category = response;
		} );


} );