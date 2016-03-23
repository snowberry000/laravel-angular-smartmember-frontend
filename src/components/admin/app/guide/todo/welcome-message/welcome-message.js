var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.welcome-message", {
			url: "/welcome-message",
			templateUrl: "/templates/components/admin/app/guide/todo/welcome-message/welcome-message.html",
			controller: "AdminAppGuideTodoWelcomeMessageController"
		} )
} );

app.controller( "AdminAppGuideTodoWelcomeMessageController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a welcome message' );

} );