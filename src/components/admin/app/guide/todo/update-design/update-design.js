var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.update-design", {
			url: "/update-design",
			templateUrl: "/templates/components/admin/app/guide/todo/update-design/update-design.html",
			controller: "AdminAppGuideTodoUpdateDesignController"
		} )
} );

app.controller( "AdminAppGuideTodoUpdateDesignController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Edit your Site\'s design' );

} );