var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.photo", {
			url: "/photo",
			templateUrl: "/templates/components/admin/app/guide/todo/photo/photo.html",
			controller: "AdminAppGuideTodoPhotoController"
		} )
} );

app.controller( "AdminAppGuideTodoPhotoController", function( $scope )
{
	$scope.SetCompleted( false );
	$scope.SetTodoTitle( 'Add your photo' );

} );