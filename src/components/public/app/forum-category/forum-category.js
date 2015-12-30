var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum-category",{
			url: "/forum-category/:permalink",
			templateUrl: "/templates/components/public/app/forum-category/forum-category.html",
			controller: "Forum-categoryController"
		})}); 


app.controller("Forum-categoryController", function ($scope,$stateParams,Restangular) {
	Restangular.one('forumCategory','permalink')
		.get({permalink: $stateParams.permalink})
		.then(function(response){
			$scope.category = response;
		});

	$scope.addTopic = function(title){
		if(!title){
			return;
		}
		Restangular.service('forumTopic')
			.post({title: title, category_id: $scope.category.id, site_id: $scope.site.id})
			.then(function(response){
				$scope.category.topics.push(response);
				$scope.title = "";
			});
	}

});