var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.transaction",{
			url: "/transaction",
			templateUrl: "/templates/components/public/sign/transaction/transaction.html"
		})
});