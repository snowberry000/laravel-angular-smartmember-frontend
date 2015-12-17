var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.core.info",{
			url: "/sales",
			templateUrl: "/templates/components/admin/site/pages/core/info/info.html",
			controller: "SalesPageController",
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", [ 'sales_page_outro', 'sales_page_content', 'sales_page_enabled', 'sales_page_embed' ] );
				}
			}
		})
}); 

app.controller("SalesPageController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr, $state) {
	$scope.sales_options = {};

	$.each($site_options, function (key, data) {
		if (data.key == 'sales_page_enabled'){
			$scope.sales_options[data.key] = parseInt(data.value);
		}else{
			$scope.sales_options[data.key] = data.value;
		}

	});

	$scope.saveSalesPage = function () {
		Restangular.all("siteMetaData").customPOST($scope.sales_options, "save").then(function () {
			toastr.success("Sales page saved!");
			$state.go('admin.site.pages.core.list');
		});
	};
});