var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.seo", {
			url: "/seo",
			templateUrl: "/templates/components/admin/app/guide/todo/seo/seo.html",
			controller: "AdminAppGuideTodoSeoController"
		} )
} );

app.controller( "AdminAppGuideTodoSeoController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'SEO settings' );

} );