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

	$scope.add = function(){
		$scope.category.site_id = $scope.site.id;
		Restangular.service('forumCategory')
			.post($scope.category)
			.then(function(response){
				console.log(response);
				$scope.categories.push(response);
			});
	}

});