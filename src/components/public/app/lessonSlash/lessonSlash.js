var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.lessonSlash",{
			url: "/lesson/:permalink/",
			templateUrl: "/templates/components/public/app/lesson/lesson.html",
			controller: "LessonController"
		})
}); 

app.controller("LessonSlashController", function ($scope) {

});