var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.stripe",{
			url: "/stripe",
			templateUrl: "/templates/components/admin/app/integrations/stripe/stripe.html",
			controller: "StripeController"
		})
}); 

app.controller("StripeController", function ($scope) {

});