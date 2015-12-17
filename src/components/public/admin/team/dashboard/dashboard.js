var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.dashboard",{
			url: "/dashboard",
			templateUrl: "/templates/components/public/admin/team/dashboard/dashboard.html",
			controller: "TeamDashboardController"
		})
}); 

app.controller("TeamDashboardController", function ($scope) {

});