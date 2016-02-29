var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.thankyou",{
			url: "/thankyou",
			templateUrl: "/templates/components/public/app/admin/pages/core/thankyou/thankyou.html",
			controller: "ThankYouCorePageController"
		})
}); 

app.controller("ThankYouCorePageController", function ($scope, $rootScope, smModal , $localStorage, $location , $stateParams,  Restangular, toastr, $state) {
	$scope.site_options = {};
	$site = $rootScope.site;
	Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", [ 'thankyou_use_custom', 'thankyou_title', 'thankyou_content', 'thankyou_image', 'thankyou_bottom_content'] ).then(function(response){
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