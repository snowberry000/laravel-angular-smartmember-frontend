var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.forum.topic.add",{
			url: "/add",
			templateUrl: "/templates/components/public/app/site/forum/topic/add/add.html",
			controller: "AddTopicController"
		})
}); 

app.controller("AddTopicController", function ($scope,$rootScope, Restangular, $filter , toastr) {

	$scope.save = function()
	{
		if(!$scope.topic || !$scope.topic.title){
			toastr.error("Empty title name not allowed")
			return;
		}
		console.log($rootScope.category);

		$scope.topic.category_id = $rootScope.category.id;
		$scope.topic.permalink = $filter('urlify')($scope.topic.title);
		Restangular.service( 'forumTopic' )	
			.post( $scope.topic )
			.then( function( response )
			{
				location.reload();
			} );
	}

});