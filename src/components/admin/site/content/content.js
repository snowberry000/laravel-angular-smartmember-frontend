var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content",{
			url: "/content",
			templateUrl: "/templates/components/admin/site/content/content.html",
			controller: "ContentController"/*,
			resolve: {
				$site: function(Restangular){
                    return Restangular.one('site','details').get();
                }
			}*/
		})
}); 

app.controller("ContentController", function ($scope) {

});