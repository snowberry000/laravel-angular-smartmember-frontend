var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.account.memberships",{
			url: "/memberships",
			templateUrl: "/templates/components/admin/account/memberships/memberships.html",
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