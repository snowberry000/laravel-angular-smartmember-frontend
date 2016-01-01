var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum.topic.add",{
			url: "/add",
			templateUrl: "/templates/components/public/app/forum/topic/add/add.html",
			controller: "AddController"
		})
}); 

app.controller("AddController", function ($scope) {

	$scope.save = function()
	{
		$scope.topic.category_id = $scope.category.id;
		$scope.topic.site_id = $scope.site.id;

		Restangular.service( 'forumTopic' )
			.post( $scope.topic )
			.then( function( response )
			{
				$scope.category.topics.push( response );
				$scope.topic = {};
			} );
	}

});