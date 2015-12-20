var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.team.helpdesk.tickets", {
			url: "/tickets",
			templateUrl: "/templates/components/public/admin/team/helpdesk/tickets/tickets.html",
		} )
} );