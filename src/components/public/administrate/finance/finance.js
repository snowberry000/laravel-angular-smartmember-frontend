var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.finance",{
			url: "/finance",
			templateUrl: "/templates/components/public/administrate/finance/finance.html",
			controller: "FinanceController"
		})
}); 

app.controller("FinanceController", function ($scope) {

});