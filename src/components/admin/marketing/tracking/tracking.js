var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.marketing.tracking",{
			url: "/tracking",
			templateUrl: "/templates/components/admin/marketing/tracking/tracking.html",
			controller: "TrackingController",
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'google_analytics_id', 'facebook_retargetting_pixel', 'facebook_conversion_pixel', 'bing_id', 'google_webmaster_tag', 'bing_webmaster_tag' ] );
				}
			}
		})
}); 

app.controller("TrackingController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr) {
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