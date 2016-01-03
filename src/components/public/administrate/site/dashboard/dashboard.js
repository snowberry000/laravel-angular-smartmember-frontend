var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.dashboard",{
			url: "/dashboard",
			templateUrl: "/templates/components/public/administrate/site/dashboard/dashboard.html",
			controller: "DashboardController",
			 resolve: {
                $site: function($rootScope){
                    return $rootScope.site;
                }
            }
		})
}); 

app.controller("DashboardController", function ($scope) {

});