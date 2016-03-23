var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.sign-up", {
			url: "/sign-up",
			templateUrl: "/templates/components/admin/app/guide/todo/sign-up/sign-up.html",
			controller: "AdminAppGuideTodoSignUpController"
		} )
} );

app.controller( "AdminAppGuideTodoSignUpController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Sign up for Smart Member' );
	$scope.SetCompletedText( 'You signed up for Smart Member' );
} );