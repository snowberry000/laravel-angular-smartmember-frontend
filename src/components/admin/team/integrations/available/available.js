var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations.available",{
			url: "/available",
			templateUrl: "/templates/components/admin/team/integrations/available/available.html",
			controller: "IntegrationsController",
			resolve: {
				$sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				$company : function(Restangular , $stateParams){
					return Restangular.one('company/getCurrentCompany').get();
				},
				$connected_accounts: function(Restangular) {
					return Restangular.all('connectedAccount').getList();
				},
				$configured_integrations: function(Restangular) {
					return Restangular.all('integration').getList();
				},
				$current_integration: function(Restangular, $stateParams) {
					if ( $stateParams.id ) {
						return Restangular.one('integration', $stateParams.id).get();
					}

					return null;
				}
			}
		})
}); 