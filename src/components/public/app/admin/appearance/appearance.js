var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.appearance",{
			url: "/appearance",
			templateUrl: "/templates/components/public/administrate/site/appearance/appearance.html",
			controller: "AppearanceController",
			 resolve: {
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

