var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site",{
			views: {
				'site': {
					templateUrl: "/templates/components/public/app/site/site.html",
					controller: "AppSiteController"
				},
				'admin': {
					template: ""
				}
			}
		})
}); 

app.controller("AppSiteController", function ($scope , $site , $rootScope) {
	$scope.lights_off = false;
	$rootScope.site = $site;
	$scope.ToggleLights = function()
	{
		$scope.lights_off = !$scope.lights_off;
	}

});