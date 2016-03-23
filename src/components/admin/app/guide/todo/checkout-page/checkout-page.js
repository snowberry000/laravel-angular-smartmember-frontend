var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.checkout-page", {
			url: "/checkout-page",
			templateUrl: "/templates/components/admin/app/guide/todo/checkout-page/checkout-page.html",
			controller: "AdminAppGuideTodoCheckoutPageController"
		} )
} );

app.controller( "AdminAppGuideTodoCheckoutPageController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a checkout page' );

} );