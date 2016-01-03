var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content.syllabus",{
			url: "/syllabus",
			templateUrl: "/templates/components/public/administrate/site/content/syllabus/syllabus.html",
			controller: "SyllabusController"
		})
}); 

app.controller("SyllabusController", function ($scope) {

});