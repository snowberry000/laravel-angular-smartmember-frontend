var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.core.info",{
			url: "/info",
			templateUrl: "/templates/components/admin/site/pages/core/info/info.html",
			controller: "InfoController",
			resolve: {
				$details: function( Restangular )
				{
					return Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", [ 'sales_page_outro', 'sales_page_content', 'sales_page_enabled', 'sales_page_embed' ] );
				}
			}
		})
}); 

app.controller("InfoController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr) {
	$scope.site_options = {};
	 $.each($site_options, function (key, data) {
	    $scope.site_options[data.key] = data.value;
	});
	 $scope.site_options.isOpen = false;
	 $rootScope.not_homepage_setting = false;

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