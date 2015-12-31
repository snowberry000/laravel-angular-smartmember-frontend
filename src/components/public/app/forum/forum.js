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
	$scope.category={};
	
	Restangular.service('forumCategory')
		.getList()
		.then(function(response){
			$scope.categories = response;
		});

	$scope.updateIcon = function($icon){
        // $scope.editing_item.icon=$icon;
        console.log($icon);
        $scope.category.icon=$icon;
    }
	$scope.add = function(){
		$scope.category.site_id = $scope.site.id;
		Restangular.service('forumCategory')
			.post($scope.category)
			.then(function(response){
				$scope.categories.push(response);
				$scope.category = {};
			});
	}

});