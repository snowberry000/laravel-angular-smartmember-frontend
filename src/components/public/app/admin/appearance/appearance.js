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

app.controller("AppearanceController", function ($scope, $rootScope, $state) {
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');
});

