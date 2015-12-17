var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.pages",{
			url: "/pages",
			templateUrl: "/templates/components/public/admin/site/pages/pages.html",
			controller: "PagesController",
			resolve: {
				$site: function(Restangular,$rootScope){
                    return Restangular.one('site','details').get();
                }
			}
		})
}); 

app.controller("PagesController", function ($scope) {

});