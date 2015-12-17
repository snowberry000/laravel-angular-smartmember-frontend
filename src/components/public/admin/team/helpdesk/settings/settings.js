var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.helpdesk.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/admin/team/helpdesk/settings/settings.html"
		})
}); 