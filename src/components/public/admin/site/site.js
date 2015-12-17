var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site",{
			url: "/site",
			templateUrl: "/templates/components/public/admin/site/site.html",
			controller: "siteController",
			resolve: {
				$site: function(Restangular,$stateParams){
					if ($stateParams.id){
						return Restangular.one('site',$stateParams.id).get();
					}
					return {};
				},
				$clone_sites: function(Restangular,$stateParams){
					return Restangular.all('site').getList({cloneable : 1});
				}
			}
		})
}); 

/*app.controller("SiteController", function ($scope) {

});*/