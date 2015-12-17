var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership",{
			url: "/membership",
			templateUrl: "/templates/components/public/admin/site/membership/membership.html",
			controller: "MembershipController"/*,
			resolve: {
				$site: function(Restangular,$rootScope){
                    return $rootScope.site;
                }
			}*/
		})
}); 

app.controller("MembershipController", function ($scope) {

});