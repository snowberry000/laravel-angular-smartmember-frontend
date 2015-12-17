var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.dashboard",{
			url: "/dashboard",
			templateUrl: "/templates/components/public/admin/site/dashboard/dashboard.html",
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