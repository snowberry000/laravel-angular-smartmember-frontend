var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.helpdesk",{
			url: "/helpdesk",
			templateUrl: "/templates/components/public/admin/team/helpdesk/helpdesk.html",
			controller: "HelpdeskController"
		})
}); 

app.controller("HelpdeskController", function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, notify) {
	if($rootScope.is_not_allowed){
        $state.go('public.admin.team.dashboard');
        return false;
    }
});