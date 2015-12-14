var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content.syllabus",{
			url: "/syllabus",
			templateUrl: "/templates/components/admin/site/content/syllabus/syllabus.html",
			controller: "SyllabusController"
		})
}); 

app.controller("SyllabusController", function ($scope) {

});