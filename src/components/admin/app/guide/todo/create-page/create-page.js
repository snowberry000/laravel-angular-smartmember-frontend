var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.create-page", {
			url: "/create-page",
			templateUrl: "/templates/components/admin/app/guide/todo/create-page/create-page.html",
			controller: "AdminAppGuideTodoCreatePageController"
		} )
} );

app.controller( "AdminAppGuideTodoCreatePageController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a Page' );

} );