var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.pages",{
			url: "/pages",
			templateUrl: "/templates/components/public/administrate/site/pages/pages.html",
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