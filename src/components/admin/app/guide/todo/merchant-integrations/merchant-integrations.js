var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.merchant-integrations", {
			url: "/merchant-integrations",
			templateUrl: "/templates/components/admin/app/guide/todo/merchant-integrations/merchant-integrations.html",
			controller: "AdminAppGuideTodoMerchantIntegrationsController"
		} )
} );

app.controller( "AdminAppGuideTodoMerchantIntegrationsController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Add a merchant integration' );

} );