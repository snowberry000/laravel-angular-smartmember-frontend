var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.appearance",{
			url: "/appearance",
			templateUrl: "/templates/components/admin/site/appearance/appearance.html",
			controller: "AppearanceController",
			 resolve: {
                $site: function(Restangular, $rootScope){
                	return $rootScope.site;
                }
            }
		})
}); 

app.controller("AppearanceController", function ($scope) {

});

