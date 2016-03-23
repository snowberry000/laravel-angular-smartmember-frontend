var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.create-pass", {
			url: "/create-pass",
			templateUrl: "/templates/components/admin/app/guide/todo/create-pass/create-pass.html",
			controller: "AdminAppGuideTodoCreatePassController"
		} )
} );

app.controller( "AdminAppGuideTodoCreatePassController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a pass' );

} );