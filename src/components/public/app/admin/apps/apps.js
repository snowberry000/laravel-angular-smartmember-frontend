var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.apps", {

			url: "/apps",
			templateUrl: "/templates/components/public/app/admin/apps/apps.html",
			controller: "appsController"
		} )
} );

app.controller( "appsController", function( $scope, $rootScope, $localStorage, $state )
{
	if( $rootScope.is_not_allowed )
	{
		//$state.go( 'public.administrate.team.dashboard' );
		return false;
	}
} );