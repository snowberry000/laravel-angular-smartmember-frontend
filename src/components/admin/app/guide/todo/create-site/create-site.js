var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.create-site", {
			url: "/create-site",
			templateUrl: "/templates/components/admin/app/guide/todo/create-site/create-site.html",
			controller: "AdminAppGuideTodoCreateSiteController"
		} )
} );

app.controller( "AdminAppGuideTodoCreateSiteController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a Smart Site' );

} );