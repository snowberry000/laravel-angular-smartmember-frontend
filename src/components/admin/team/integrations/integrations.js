var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations",{
			url: "/integrations",
			templateUrl: "/templates/components/admin/team/integrations/integrations.html",
			controller: "IntegrationsController",
			resolve: {
				$sites : function(Restangular){
					return {sites: null};
				},
				$company : function() {
					return null;
				},
				$connected_accounts: function(Restangular) {
					return null;
				},
				$configured_integrations: function(Restangular) {
					return null;
				},
				$current_integration: function(Restangular, $stateParams) {
					return null;
				}
			}
		})
}); 