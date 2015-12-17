var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.finance.transactions",{
			url: "/transactions",
			templateUrl: "/templates/components/public/admin/finance/transactions/transactions.html",
			controller: "TransactionsController",
			resolve: {
				$transactions: function( Restangular, $site )
				{
					return Restangular.all( 'transaction' ).getList( { site_id: $site.id } );
				}
			}
		})
}); 
