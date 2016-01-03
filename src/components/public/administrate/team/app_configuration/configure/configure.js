var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.integration.configure", {
			url: "/configure/:id?",
			params: {
				site_id: null,
				team: null
			},
			templateUrl: function( $stateParams )
			{
				return 'templates/components/public/administrate/team/app_configuration/configure/' + $stateParams.integration + '.html'
			},
			//templateUrl: "/templates/components/public/administrate/team/integration/configure/"+ $stateParams.integration +".html",
			controller: "app_configurationsController"
		} )
} );