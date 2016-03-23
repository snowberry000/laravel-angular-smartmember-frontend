var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.thankyou-page", {
			url: "/thankyou-page",
			templateUrl: "/templates/components/admin/app/guide/todo/thankyou-page/thankyou-page.html",
			controller: "AdminAppGuideTodoThankyouPageController"
		} )
} );

app.controller( "AdminAppGuideTodoThankyouPageController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a thank-you page' );

} );