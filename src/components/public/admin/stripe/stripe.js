var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.stripe",{
			url: "/stripe",
			templateUrl: "/templates/components/public/admin/stripe/stripe.html",
			controller: "StripeController"
		})
}); 

app.controller("StripeController", function ($scope) {

});