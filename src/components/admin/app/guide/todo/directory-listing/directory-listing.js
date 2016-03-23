var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.directory-listing", {
			url: "/directory-listing",
			templateUrl: "/templates/components/admin/app/guide/todo/directory-listing/directory-listing.html",
			controller: "AdminAppGuideTodoDirectoryListingController"
		} )
} );

app.controller( "AdminAppGuideTodoDirectoryListingController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Directory listing' );

} );