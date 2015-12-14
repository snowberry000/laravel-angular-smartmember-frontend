var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.membership.transactions",{
			url: "/transactions",
			templateUrl: "/templates/components/admin/site/membership/transactions/transactions.html",
			controller: "TransactionsController"
		})
}); 
