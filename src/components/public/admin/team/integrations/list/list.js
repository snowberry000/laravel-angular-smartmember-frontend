var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.integrations.list",{
			url: "/list",
			templateUrl: "/templates/components/public/admin/team/integrations/list/list.html",
			controller: "IntegrationsController"
		})
});