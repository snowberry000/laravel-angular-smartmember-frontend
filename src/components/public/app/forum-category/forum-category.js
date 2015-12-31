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

	$scope.addTopic = function(){
		$scope.topic.category_id = $scope.category.id;
		$scope.topic.site_id = $scope.site.id;

		Restangular.service('forumTopic')
			.post($scope.topic)
			.then(function(response){
				$scope.category.topics.push(response);
				$scope.topic = {};
			});
	}

});