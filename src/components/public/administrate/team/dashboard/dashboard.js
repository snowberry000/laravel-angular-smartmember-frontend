var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.dashboard",{
			url: "/dashboard",
			templateUrl: "/templates/components/public/administrate/team/dashboard/dashboard.html",
			controller: "TeamDashboardController"
		})
}); 

app.controller("TeamDashboardController", function ($scope) {

});