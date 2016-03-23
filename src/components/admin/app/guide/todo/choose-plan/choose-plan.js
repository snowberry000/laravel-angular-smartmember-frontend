var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.choose-plan", {
			url: "/choose-plan",
			templateUrl: "/templates/components/admin/app/guide/todo/choose-plan/choose-plan.html",
			controller: "AdminAppGuideTodoChoosePlanController"
		} )
} );

app.controller( "AdminAppGuideTodoChoosePlanController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Choose a plan' );

} );