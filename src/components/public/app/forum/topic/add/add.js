var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum.topic.add",{
			url: "/add",
			templateUrl: "/templates/components/public/app/forum/topic/add/add.html",
			controller: "AddTopicController"
		})
}); 

app.controller("AddTopicController", function ($scope,$rootScope, Restangular) {

	$scope.save = function()
	{
		console.log($rootScope.category);

		$scope.topic.category_id = $rootScope.category.id;
		$scope.topic.site_id = $rootScope.category.id;

		Restangular.service( 'forumTopic' )	
			.post( $scope.topic )
			.then( function( response )
			{
				location.reload();
			} );
	}

});