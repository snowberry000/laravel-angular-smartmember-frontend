var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.helpdesk",{
			url: "/helpdesk",
			templateUrl: "/templates/components/admin/team/helpdesk/helpdesk.html",
			controller: "HelpdeskController"
		})
}); 

app.controller("HelpdeskController", function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, notify) {
	if($rootScope.is_not_allowed){
        $state.go('admin.team.dashboard');
        return false;
    }
});