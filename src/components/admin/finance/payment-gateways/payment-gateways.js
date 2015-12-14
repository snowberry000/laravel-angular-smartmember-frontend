var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.finance.payment-gateways",{
			url: "/payment-gateways",
			templateUrl: "/templates/components/admin/finance/payment-gateways/payment-gateways.html",
			controller: "PaymentGatewaysController"
		})
}); 

app.controller("PaymentGatewaysController", function ($scope, $localStorage, $modal, Restangular,$site, notify) {
	$scope.copyToClipBoard = function()
	{
		return "copied";
	}
});