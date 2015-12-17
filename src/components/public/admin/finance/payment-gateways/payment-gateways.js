var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.finance.payment-gateways",{
			url: "/payment-gateways",
			templateUrl: "/templates/components/public/admin/finance/payment-gateways/payment-gateways.html",
			controller: "PaymentGatewaysController"
		})
}); 

app.controller("PaymentGatewaysController", function ($scope, $localStorage, $modal, Restangular,$site, notify) {
	$scope.copyToClipBoard = function()
	{
		return "copied";
	}
});