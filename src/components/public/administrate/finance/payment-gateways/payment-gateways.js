var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.finance.payment-gateways",{
			url: "/payment-gateways",
			templateUrl: "/templates/components/public/administrate/finance/payment-gateways/payment-gateways.html",
			controller: "PaymentGatewaysController"
		})
}); 

app.controller("PaymentGatewaysController", function ($scope, $localStorage,  Restangular,$site, notify) {
	$scope.copyToClipBoard = function()
	{
		return "copied";
	}
});