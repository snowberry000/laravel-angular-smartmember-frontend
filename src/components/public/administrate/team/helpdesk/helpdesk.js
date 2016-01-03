var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.helpdesk",{
			url: "/helpdesk",
			templateUrl: "/templates/components/public/administrate/team/helpdesk/helpdesk.html",
			controller: "HelpdeskController"
		})
}); 

app.controller("HelpdeskController", function ($scope, $rootScope , $localStorage,$state,  Restangular, notify) {
	if($rootScope.is_not_allowed){
        $state.go('public.administrate.team.dashboard');
        return false;
    }
});