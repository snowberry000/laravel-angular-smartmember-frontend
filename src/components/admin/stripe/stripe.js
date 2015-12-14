var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.stripe",{
			url: "/stripe",
			templateUrl: "/templates/components/admin/stripe/stripe.html",
			controller: "StripeController"
		})
}); 

app.controller("StripeController", function ($scope) {

});