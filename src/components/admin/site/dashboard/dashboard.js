var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.dashboard",{
			url: "/dashboard",
			templateUrl: "/templates/components/admin/site/dashboard/dashboard.html",
			controller: "DashboardController",
			 resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                }
            }
		})
}); 

app.controller("DashboardController", function ($scope) {

});