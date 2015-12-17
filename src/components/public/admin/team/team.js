var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team",{
			
			url: "/team",
			templateUrl: "/templates/components/public/admin/team/team.html",
			controller: "TeamController"
		})
}); 

app.controller("TeamController", function ($scope, $rootScope , $localStorage , $state) {
	if($rootScope.is_not_allowed){
	    $state.go('public.admin.team.dashboard');
	    return false;
	}
});