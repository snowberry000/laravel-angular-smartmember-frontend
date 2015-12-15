var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.membership",{
			url: "/membership",
			templateUrl: "/templates/components/admin/site/membership/membership.html",
			controller: "MembershipController",
			resolve: {
				$site: function(Restangular,$rootScope){
                    return $rootScope.site;
                }
			}
		})
}); 

app.controller("MembershipController", function ($scope) {

});