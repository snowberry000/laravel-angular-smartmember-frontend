var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.protect-content", {
			url: "/protect-content",
			templateUrl: "/templates/components/admin/app/guide/todo/protect-content/protect-content.html",
			controller: "AdminAppGuideTodoProtectContentController"
		} )
} );

app.controller( "AdminAppGuideTodoProtectContentController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Protect content' );

} );