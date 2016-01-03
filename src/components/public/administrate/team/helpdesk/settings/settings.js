var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.helpdesk.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/administrate/team/helpdesk/settings/settings.html"
		})
}); 