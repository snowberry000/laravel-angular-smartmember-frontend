var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.membership.transactions", {
			url: "/transactions",
			templateUrl: "/templates/components/public/administrate/site/membership/transactions/transactions.html",
			controller: "TransactionsController"
		} )
} );
