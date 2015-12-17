var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.transactions",{
			url: "/transactions",
			templateUrl: "/templates/components/public/admin/site/membership/transactions/transactions.html",
			controller: "TransactionsController"
		})
}); 
