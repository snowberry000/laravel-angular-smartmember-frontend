var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.helpdesk.tickets",{
			url: "/tickets",
			templateUrl: "/templates/components/admin/team/helpdesk/tickets/tickets.html",
		})
});