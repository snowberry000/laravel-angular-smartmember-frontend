var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content",{
			url: "/content",
			templateUrl: "/templates/components/public/administrate/site/content/content.html",
			controller: "ContentController",
			resolve: {
				$site: function(Restangular, $rootScope){
                    return $rootScope.site;
                }
			}
		})
}); 

app.controller("ContentController", function ($scope) {

});