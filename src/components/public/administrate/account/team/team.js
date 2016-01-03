var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.account.team",{
			url: "/team/:id?",
			templateUrl: "/templates/components/public/administrate/account/team/team.html",
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

app.controller("TeamController", function ($scope) {

});