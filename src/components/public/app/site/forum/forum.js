var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.site.forum", {
			templateUrl: "/templates/components/public/app/site/forum/forum.html",
			controller: "ForumController"
		} )
} );

app.controller( "ForumController", function( $scope, Restangular )
{
	$scope.categories = false;

} );