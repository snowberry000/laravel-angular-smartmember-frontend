var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.smart-links", {
			url: "/smart-links",
			templateUrl: "/templates/components/admin/app/guide/todo/smart-links/smart-links.html",
			controller: "AdminAppGuideTodoSmartLinksController"
		} )
} );

app.controller( "AdminAppGuideTodoSmartLinksController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Smart Links' );

} );