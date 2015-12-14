var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations.list",{
			url: "/list",
			templateUrl: "/templates/components/admin/team/integrations/list/list.html",
			controller: "IntegrationsController"
		})
});