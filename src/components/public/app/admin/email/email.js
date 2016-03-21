var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.email", {
			url: "/email",
			templateUrl: "/templates/components/public/app/admin/email/email.html",
			controller: "EmailController"
		} )
} );

app.controller( "EmailController", function( $scope, $rootScope, $localStorage, $state, Restangular, notify )
{
	if( $rootScope.site && $rootScope.site.capabilities.indexOf( 'manage_email' ) == -1 )
	{
		$state.go( 'public.app.site.home' );
	}

	if( $rootScope.is_not_allowed )
	{
		$state.go( 'public.administrate.team.dashboard' );
		return false;
	}
} );