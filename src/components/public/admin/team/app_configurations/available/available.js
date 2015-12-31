var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.team.app_configurations.available", {
			url: "/available",
			templateUrl: "/templates/components/public/admin/team/app_configurations/available/available.html",
			controller: "app_configurationsController"
		} )
} );