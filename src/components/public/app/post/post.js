var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.post",{
			url: "/post/:permalink",
			templateUrl: "/templates/components/public/app/post/post.html",
			controller: "PublicPostController"
		})
}); 

app.controller('PublicPostController', function ($scope,$rootScope, $localStorage, $state, $stateParams,  $filter, Restangular, toastr) {
    $scope.comment = '';
    $scope.child_comment = '';
    $scope.user = $localStorage.user;
    $scope.loading=true;
    $site = $rootScope.site;
    Restangular.one('postByPermalink', $stateParams.permalink).get().then(function(response){
        $post=response;
        $scope.loading=false;
        $scope.post = $post;
        $scope.next_item = $scope.post;
        $rootScope.page_title = $post.title || $rootScope.page_title;
        if( $scope.post.access_level_type == 4 )
        {
            var view_content = false;
            if ($site && $site.capabilities)
            {
                if ($site.capabilities.indexOf('manage_content') != -1)
                {
                    view_content = true;
                }
            }
            if( !view_content )
            	$state.go('public.app.blog');
        }
        Restangular.all('').customGET('comment?target_id='+$scope.post.id+'&type='+4).then(function(comments){
           $scope.post.comments = _.toArray(comments.comments)
        });
    })

    $scope.saveComment = function(body){
        Restangular.all('comment').post({target_id:$scope.post.id , type:4 ,body:body , public:$scope.post.discussion_settings.public_comments}).then(function(comment){
            $scope.post.comments.push(comment);
            toastr.success("Your comment is added!");

        })
    }

    $scope.TriggerEmbeds = function() {
        $('.ui.embed').embed();
    }

    $scope.saveReply = function(comment , body){
        Restangular.all('comment').post({target_id:$scope.post.id , type:4 , parent_id : comment.id ,body:body , public:$scope.post.discussion_settings.public_comments}).then(function(reply){
            comment.reply.push(reply);
            toastr.success("Your reply is added!");

        })
    }

    $scope.deleteComment = function(comment){
        if(!$scope.user.id == comment.user_id){
            toastr.error("Sorry , you are not authorized to remove this comment");
            return;
        }
        Restangular.one('comment' , comment.id).remove().then(function(response){
            $scope.post.comments = _.without($scope.post.comments, comment);
        })
    }

     $scope.deleteReply = function(reply , comment){
        if(!$scope.user.id == reply.user_id){
            toastr.error("Sorry , you are not authorized to remove this reply");
            return;
        }
        Restangular.one('comment' , reply.id).remove().then(function(response){
            comment.reply = _.without(comment.reply, reply);
        })
    }

    $scope.commentPermission = function(){
        return ($scope.post.discussion_settings.show_comments && !$scope.post.discussion_settings.close_to_new_comments);
    }

    $scope.replyPermission = function(){
        if($scope.commentPermission());
        return ($scope.post.discussion_settings.show_comments && !$scope.post.discussion_settings.close_to_new_comments && $scope.post.discussion_settings.allow_replies );
    }

});
