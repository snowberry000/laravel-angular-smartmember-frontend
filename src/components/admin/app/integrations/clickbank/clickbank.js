var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.clickbank",{
			url: "/clickbank",
			templateUrl: "/templates/components/admin/app/integrations/clickbank/clickbank.html",
			controller: "ClickbankController"
		})
}); 

app.controller("ClickbankController", function ($scope) {

});