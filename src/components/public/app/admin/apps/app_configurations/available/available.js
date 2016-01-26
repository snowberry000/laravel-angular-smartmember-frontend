var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.apps.app_configurations.available", {
			url: "/available",
			templateUrl: "/templates/components/public/app/admin/apps/app_configurations/available/available.html",
			controller: "app_configurationsController"
		} )
} );