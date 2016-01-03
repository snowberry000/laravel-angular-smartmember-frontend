var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.account.memberships",{
			url: "/memberships",
			templateUrl: "/templates/components/public/administrate/account/memberships/memberships.html",
			controller: "DirectoryController",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'wu.masonry'
                        }
                    ]);
                }
            }
		})
}); 

app.controller("MembershipsController", function ($scope) {

});