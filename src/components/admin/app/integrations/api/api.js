var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.api",{
			url: "/api",
			templateUrl: "/templates/components/admin/app/integrations/api/api.html",
			controller: "ApiController"
		})
}); 

app.controller("ApiController", function ($scope ,$localStorage , $rootScope , RestangularV3) {

	$scope.refresh = function(){
		RestangularV3.all('company').customPOST({} , 'refreshToken').then(function(response){
			$rootScope.current_company = response;
			$scope.current_company = response;
		})
	}
});