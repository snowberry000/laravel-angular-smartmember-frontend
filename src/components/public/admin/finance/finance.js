var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.finance",{
			url: "/finance",
			templateUrl: "/templates/components/public/admin/finance/finance.html",
			controller: "FinanceController"
		})
}); 

app.controller("FinanceController", function ($scope) {

});