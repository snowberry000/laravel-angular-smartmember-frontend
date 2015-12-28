var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.forum-topic",{
			url: "/forum-topic/:permalink",
			templateUrl: "/templates/components/public/app/forum-topic/forum-topic.html",
			controller: "Forum-topicController"
		})
}); 

app.controller("Forum-topicController", function ($scope,$stateParams, Restangular) {
	Restangular.one('forumTopic','permalink')
		.get({permalink: $stateParams.permalink})
		.then(function(response){
			$scope.topic = response;
		});

	$scope.addReply = function(content){
		Restangular.service('forumReply')
			.post({content: content, topic_id: $scope.topic.id, category_id: $scope.topic.category.id})
			.then(function(response){
				$scope.topic.replies.push(response);
				$scope.content = "";
			});
	}

	$scope.replyComment = function(content){
		$scope.content = "<blockquote>" + content + "</blockquote> <br/>";
		$scope.scrollBottom();
	}

	$scope.scrollBottom = function(){
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	}

});