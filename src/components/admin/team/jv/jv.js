var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.jv",{
			url: "/jv",
			templateUrl: "/templates/components/admin/team/jv/jv.html",
			controller: "JvController"
		})
}); 

app.controller("JvController", function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, toastr) {
	if($rootScope.is_not_allowed){
	    $state.go('admin.team.dashboard');
	    return false;
	}
});