var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.finance_settings",{
			url: "/finance_settings",
			templateUrl: "/templates/components/public/admin/site/membership/finance_settings/finance_settings.html",
			controller: "FinanceSettingsController",
			resolve: {
				$site_options : function(Restangular){
					return Restangular.all('siteMetaData').customGETLIST("getOptions", ['currency']);
				}
			}
		})
}); 

app.controller("FinanceSettingsController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr) {
	 $scope.site_options = {};
	 $.each($site_options, function (key, data) {
	    $scope.site_options[data.key] = data.value;
	});
	 $scope.site_options.isOpen = false;

	 $scope.save = function () {
	     delete $scope.site_options.url;
	     delete $scope.site_options.open;
	     Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
	         toastr.success("Options are saved!");
	         $scope.site_options.isOpen = false;
	         $localStorage.homepage_url = $scope.site_options.homepage_url;
	     });
	 }
});