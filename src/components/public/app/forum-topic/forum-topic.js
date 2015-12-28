var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum-topic",{
			url: "/forum-topic/:permalink",
			templateUrl: "/templates/components/public/app/forum-topic/forum-topic.html",
			controller: "Forum-topicController"
		})
}); 

app.controller("Forum-topicController", function ($scope) {

});