var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team", {

			url: "/team",
			templateUrl: "/templates/components/public/administrate/team/team.html",
			controller: "TeamController"
		} )
} );

app.controller( "TeamController", function( $scope, $rootScope, $localStorage, $state )
{
	if( $rootScope.is_not_allowed )
	{
		//$state.go( 'public.administrate.team.dashboard' );
		return false;
	}
} );