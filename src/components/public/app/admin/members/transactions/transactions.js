var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.members.transactions", {
			url: "/transactions",
			templateUrl: "/templates/components/public/app/admin/members/transactions/transactions.html",
			controller: "TransactionsController"
		} )
} );
