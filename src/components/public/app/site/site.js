var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site",{
			sticky: true,
			abstract: true,
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

app.controller("AppSiteController", function ($scope) {

	$scope.lights_off = false;

	$scope.ToggleLights = function()
	{
		$scope.lights_off = !$scope.lights_off;
	}

});