var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.marketing.tracking",{
			url: "/tracking",
			templateUrl: "/templates/components/public/admin/marketing/tracking/tracking.html",
			controller: "TrackingController",
		})
}); 

app.controller("TrackingController", function ($scope, $rootScope, $localStorage, $location,$stateParams, $modal, Restangular, toastr) {


	$site_options=null;
	$site=$rootScope.site;
	$scope.resolve =function() {
		Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'currency' ] ).then(function(response){
			$site_options=response;
			 $scope.site_options = {};
			 $.each($site_options, function (key, data) {
			    $scope.site_options[data.key] = data.value;
			});
			 $scope.site_options.isOpen = false;
		});
	}

	 $scope.save = function () {
	     delete $scope.site_options.url;
	     delete $scope.site_options.open;
	     Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
	         toastr.success("Options are saved!");
	         $scope.site_options.isOpen = false;
	         $localStorage.homepage_url = $scope.site_options.homepage_url;
	     });
	 }

	 $scope.resolve();

});