var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.appearance",{
			url: "/appearance",
			templateUrl: "/templates/components/public/admin/site/appearance/appearance.html",
			controller: "AppearanceController",
			 resolve: {
                $site: function(Restangular, $rootScope){
                	return $rootScope.site;
                },
                loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'ui-iconpicker',
							files: ['bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js']
						}
					]);
				}
            }
		})
}); 

app.controller("AppearanceController", function ($scope) {

});

