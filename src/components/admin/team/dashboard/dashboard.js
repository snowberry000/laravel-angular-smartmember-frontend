var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.dashboard",{
			url: "/dashboard",
			templateUrl: "/templates/components/admin/team/dashboard/dashboard.html",
			controller: "TeamDashboardController"
		})
}); 

app.controller("TeamDashboardController", function ($scope) {

});