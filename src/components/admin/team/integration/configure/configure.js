var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integration.configure",{
			url: "/configure/:id?",
			params: {
				site_id: null,
				team: null
			},
			templateUrl: function($stateParams) {
				return 'templates/components/admin/team/integration/configure/' + $stateParams.integration + '.html'
			},
			//templateUrl: "/templates/components/admin/team/integration/configure/"+ $stateParams.integration +".html",
			controller: "IntegrationsController"
		})
}); 