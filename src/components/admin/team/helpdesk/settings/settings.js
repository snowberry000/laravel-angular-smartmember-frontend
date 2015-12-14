var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.helpdesk.settings",{
			url: "/settings",
			templateUrl: "/templates/components/admin/team/helpdesk/settings/settings.html"
		})
}); 