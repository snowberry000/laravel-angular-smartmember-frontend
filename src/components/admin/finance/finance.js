var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.finance",{
			url: "/finance",
			templateUrl: "/templates/components/admin/finance/finance.html",
			controller: "FinanceController"
		})
}); 

app.controller("FinanceController", function ($scope) {

});