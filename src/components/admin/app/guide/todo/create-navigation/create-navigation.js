var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.create-navigation", {
			url: "/create-navigation",
			templateUrl: "/templates/components/admin/app/guide/todo/create-navigation/create-navigation.html",
			controller: "AdminAppGuideTodoCreateNavigationController"
		} )
} );

app.controller( "AdminAppGuideTodoCreateNavigationController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a navigation menu' );

} );