var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.guide.todo.invite-team", {
			url: "/invite-team",
			templateUrl: "/templates/components/admin/app/guide/todo/invite-team/invite-team.html",
			controller: "AdminAppGuideTodoInviteTeamController"
		} )
} );

app.controller( "AdminAppGuideTodoInviteTeamController", function( $scope )
{
	$scope.SetCompleted( true );
	$scope.SetTodoTitle( 'Invite your team' );
	$scope.SetCompletedText( 'Sent invitations to team members' );

} );