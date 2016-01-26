var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.livecast",{
			url: "/livecast/:permalink",
			templateUrl: "/templates/components/public/app/livecast/livecast.html",
			controller: "PublicLivecastController"
		})
}); 

app.controller('PublicLivecastController',function($scope,$rootScope,$http,$stateParams,$localStorage,Restangular,smModal){

    $scope.comment = '';
    $scope.child_comment = '';
    $scope.user = $localStorage.user;
    $scope.loading=true;

    Restangular.one('livecastByPermalink' , $stateParams.permalink).get().then(function(response){
        $livecast=response;
        $scope.loading=false;
        $scope.next_item = $livecast;
        $rootScope.page_title = $livecast.title || $rootScope.page_title;
        Restangular.all('').customGET('comment?target_id='+$scope.next_item.id+'&type='+5).then(function(comments){
               $scope.next_item.comments = _.toArray(comments.comments)
            });
    })

    
    

    
    $scope.saveComment = function(body){
        if(!$scope.user){
            toastr.error("Sorry , you must be logged in to comment");
            return;
        }
        Restangular.all('comment').post({target_id:$scope.next_item.id , type:5 ,body:body , public:$scope.next_item.discussion_settings.public_comments}).then(function(comment){
            $scope.next_item.comments.push(comment);
            toastr.success("Your comment is added!");

        })
    }

    $scope.saveReply = function(comment , body){
        if(!$scope.user){
            toastr.error("Sorry , you must be logged in to comment");
            return;
        }
        Restangular.all('comment').post({target_id:$scope.next_item.id , type:5 , parent_id : comment.id ,body:body , public:$scope.next_item.discussion_settings.public_comments}).then(function(reply){
            comment.reply.push(reply);
        })
    }

    $scope.deleteComment = function(comment){
        if(!$scope.user.id == comment.user_id){
            toastr.error("Sorry , you are not authorized to remove this comment");
            return;
        }
        Restangular.one('comment' , comment.id).remove().then(function(response){
            $scope.next_item.comments = _.without($scope.next_item.comments, comment);
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
        return ($scope.next_item.discussion_settings.show_comments && !$scope.next_item.discussion_settings.close_to_new_comments);
    }

    $scope.replyPermission = function(){
        if($scope.commentPermission());
        return ($scope.next_item.discussion_settings.show_comments && !$scope.next_item.discussion_settings.close_to_new_comments && $scope.next_item.discussion_settings.allow_replies );
    }

    $scope.showNoAccessLogin = function() {
        if (!$localStorage.user || !$localStorage.user.access_token)
        {
            smModal.Show('public.sign.in');
        }
    }

});