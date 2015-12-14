var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.email.segments",{
			url: "/segments",
			templateUrl: "/templates/components/admin/team/email/segments/segments.html",
			controller: "SegmentsController"
		})
});