var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum",{
			url: "/forum",
			templateUrl: "/templates/components/public/app/forum/forum.html",
			controller: "ForumController"
		})
}); 

app.controller("ForumController", function ($scope,Restangular) {
	$scope.categories = false;
	
	Restangular.service('forumCategory')
		.getList()
		.then(function(response){
			$scope.categories = response;
		});

});