var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.web",{
			url: "/web",
			templateUrl: "/templates/components/admin/app/integrations/web/web.html",
			controller: "AdminAppIntegrationsWebController"
		})
}); 

app.controller("AdminAppIntegrationsWebController", function ($scope) {

});