var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.finance.transactions",{
			url: "/transactions",
			templateUrl: "/templates/components/public/admin/finance/transactions/transactions.html",
			controller: "TransactionsController",
		})
}); 
