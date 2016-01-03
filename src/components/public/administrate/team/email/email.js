var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.email", {
			url: "/email",
			templateUrl: "/templates/components/public/administrate/team/email/email.html",
			controller: "EmailController"
		} )
} );

app.controller( "EmailController", function( $scope, $rootScope, $localStorage, $state, Restangular, notify )
{
	if( $rootScope.is_not_allowed )
	{
		$state.go( 'public.administrate.team.dashboard' );
		return false;
	}
} );