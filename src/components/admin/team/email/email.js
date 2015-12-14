var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.email",{
			url: "/email",
			templateUrl: "/templates/components/admin/team/email/email.html",
			controller: "EmailController"
		})
}); 

app.controller("EmailController", function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, notify) {
	if($rootScope.is_not_allowed){
        $state.go('admin.team.dashboard');
        return false;
    }
});