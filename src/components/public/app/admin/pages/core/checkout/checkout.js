var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.checkout",{
			url: "/checkout",
			templateUrl: "/templates/components/public/app/admin/pages/core/checkout/checkout.html",
			controller: "CheckoutCorePageController"
		})
}); 

app.controller("CheckoutCorePageController", function ($scope, $rootScope, smModal , $localStorage, $location , $stateParams,  Restangular, toastr, $state) {
	$scope.site_options = {};
	$site = $rootScope.site;
	var fields = [
		'checkout_header_content',
		'order_review_text',
		'stripe_text',
		'stripe_image',
		'stripe_description_text',
		'stripe_button_image',
		'paypal_text',
		'paypal_image',
		'paypal_description_text',
		'paypal_button_image',
		'checkout_footer_content',
	];
	Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", fields ).then(function(response){
		$.each(response , function (key, data) {
				$scope.site_options[data.key] = data.value;
		});
	})

	$scope.saveSettings = function () {
		Restangular.all("siteMetaData").customPOST($scope.site_options, "save").then(function () {
			toastr.success("Thank you page saved!");
			$state.go('public.app.admin.pages.core.list');
		});
	};
});