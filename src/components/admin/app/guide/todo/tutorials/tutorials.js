var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.tutorials", {
			url: "/tutorials",
			templateUrl: "/templates/components/admin/app/guide/todo/tutorials/tutorials.html",
			controller: "AdminAppGuideTodoTutorialsController"
		} )
} );

app.controller( "AdminAppGuideTodoTutorialsController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Take a tutorial' );
	$scope.SetCompletedText( 'You finished your first tutorial' );

} );