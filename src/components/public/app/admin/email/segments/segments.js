var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.segments",{
			url: "/segments",
			templateUrl: "/templates/components/public/administrate/team/email/segments/segments.html",
			controller: "SegmentsController"
		})
});