var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.finance.settings",{
			url: "/settings",
			templateUrl: "/templates/components/admin/finance/settings/settings.html",
			controller: "SettingsController",
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'currency' ] );
				}
			}
		})
}); 

app.controller("SettingsController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr) {
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