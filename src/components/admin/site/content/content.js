var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content",{
			url: "/content",
			templateUrl: "/templates/components/admin/site/content/content.html",
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