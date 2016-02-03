var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages",{
			url: "/pages",
			templateUrl: "/templates/components/public/app/admin/pages/pages.html",
			controller: "PagesController",
			resolve: {
				$site: function(Restangular,$rootScope){
                    return Restangular.one('site','details').get();
                }
			}
		})
}); 

app.controller("PagesController", function ($scope, $state) {
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');
});