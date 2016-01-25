var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.info",{
			url: "/sales",
			templateUrl: "/templates/components/public/app/admin/pages/core/info/info.html",
			controller: "SalesPageController"
		})
}); 

app.controller("SalesPageController", function ($scope, $rootScope, smModal , $localStorage, $location , $stateParams,  Restangular, toastr, $state) {
	$scope.sales_options = {};
	$site = $rootScope.site;
	Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", [ 'sales_page_outro', 'sales_page_content', 'sales_page_enabled', 'sales_page_embed','narrow_style' ] ).then(function(response){
		$.each(response , function (key, data) {
			if (data.key == 'sales_page_enabled' || data.key == 'narrow_style'){
				$scope.sales_options[data.key] = parseInt(data.value);
			} else{
				$scope.sales_options[data.key] = data.value;
			}

		});
	})

	$scope.saveSalesPage = function () {
		Restangular.all("siteMetaData").customPOST($scope.sales_options, "save").then(function () {
			toastr.success("Sales page saved!");
			$state.go('public.app.admin.pages.core.list');
		});
	};
});