var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.jv",{
			url: "/jv",
			templateUrl: "/templates/components/public/administrate/team/jv/jv.html",
			controller: "JvController"
		})
}); 

app.controller("JvController", function ($scope, $rootScope , $localStorage,$state,  Restangular, toastr) {
	if($rootScope.is_not_allowed){
	    $state.go('public.administrate.team.dashboard');
	    return false;
	}
});