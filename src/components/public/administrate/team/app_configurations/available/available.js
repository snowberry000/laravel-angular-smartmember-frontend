var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.app_configurations.available", {
			url: "/available",
			templateUrl: "/templates/components/public/administrate/team/app_configurations/available/available.html",
			controller: "app_configurationsController"
		} )
} );