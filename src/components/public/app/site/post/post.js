var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.post",{
			url: "/post/:permalink",
			templateUrl: "/templates/components/public/app/site/post/post.html",
			controller: "PublicPostController"
		})
}); 

app.controller('PublicPostController', function ($scope,$rootScope, $localStorage, $state, $stateParams,  $filter, Restangular, toastr) {
    $scope.comment = '';
    $scope.child_comment = '';
    $scope.user = $localStorage.user;
    $scope.loading=true;
    $site = $rootScope.site;
    $scope.pagination = {
        current_page: 1,
        per_page: 25,
        total_count: 0,
        disable : true
    };
    Restangular.one('postByPermalink', $stateParams.permalink).get().then(function(response){
        $post=response;
        $scope.loading=false;
        $scope.post = $post;
        $scope.next_item = $scope.post;
        $rootScope.setSocialShareForContent( $scope.next_item );
        $rootScope.widget_target_type = 'post';
        $rootScope.widget_target = $scope.next_item.id;
        $scope.next_item.content_type = 'post';
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
            	$state.go('public.app.site.blog');
        }
        $scope.pagination.disable = false;
        $scope.paginate();
        // Restangular.all('').customGET('comment?target_id='+$scope.post.id+'&type='+4).then(function(comments){
        //    $scope.post.comments = _.toArray(comments.comments)
        // });
    })

    $scope.paginate = function( search )
    {
        if(!$scope.post.comments || $scope.post.comments.length==0){
            $scope.post.comments = [];
            $scope.loading = true;
        }
        $scope.pagination.disable=true;
        if( search )
        {
            $scope.pagination.current_page = 1;
        }

        var $params = { p: $scope.pagination.current_page };

        Restangular.all( '' ).customGET( 'comment?target_id=' + $scope.post.id + '&type=' + 4 + '&p=' + $params.p).then( function( data )
        {
            $scope.loading = false;
            $scope.pagination.current_page++;
            $scope.pagination.total_count = data.total_count;

            if(data && data.items && data.items.length > 0)
            {
                $scope.pagination.disable = false;
            }
            $scope.post.comments = $scope.post.comments.concat( data.items )
        } );
    }

    $scope.saveComment = function(body){

         if(!body || body.trim().length <= 0){
            toastr.error( "Sorry , comment cannot be empty!" );
            return;
        }

        Restangular.all('comment').post({target_id:$scope.post.id , type:4 ,body:body , public:$scope.post.discussion_settings.public_comments}).then(function(comment){
            $scope.post.comments.push(comment);
            toastr.success("Your comment is added!");

        })
    }

    $scope.TriggerEmbeds = function() {
        $('.ui.embed').embed();
    }

    $scope.saveReply = function(comment , body){

         if(!body || body.trim().length <= 0){
            toastr.error( "Sorry , comment cannot be empty!" );
            return;
        }

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
