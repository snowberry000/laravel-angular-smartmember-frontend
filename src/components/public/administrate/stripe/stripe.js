var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.stripe",{
			url: "/stripe",
			templateUrl: "/templates/components/public/administrate/stripe/stripe.html",
			controller: "StripeController"
		})
}); 

app.controller("StripeController", function ($scope) {

});