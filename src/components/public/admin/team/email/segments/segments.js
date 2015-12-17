var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.email.segments",{
			url: "/segments",
			templateUrl: "/templates/components/public/admin/team/email/segments/segments.html",
			controller: "SegmentsController"
		})
});