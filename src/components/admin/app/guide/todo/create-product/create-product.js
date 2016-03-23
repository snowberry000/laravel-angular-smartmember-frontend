var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.create-product", {
			url: "/create-product",
			templateUrl: "/templates/components/admin/app/guide/todo/create-product/create-product.html",
			controller: "AdminAppGuideTodoCreateProductController"
		} )
} );

app.controller( "AdminAppGuideTodoCreateProductController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Create a product' );

} );