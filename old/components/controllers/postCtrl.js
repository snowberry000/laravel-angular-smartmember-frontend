

app.controller('adminPostsController', function ($scope, $localStorage, $site ,$state, $stateParams, $modal, $filter, Restangular, toastr ) {
    $scope.template_data = {
        title: 'BLOG_POSTS',
        description: 'Posts are the informational material of your site that go in the blog.',
        singular: 'post',
        edit_route: 'admin.site.content.blog.post',
        api_object: 'post'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {current_page: 1};
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }

    $scope.delete = function (id) {

        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return id
                }
            }

        });
        modalInstance.result.then(function () {
            var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
                return next_item.id === id;
            });

            itemWithId.remove().then(function () {
                $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
            });
        })
    };
});

app.controller('adminPostController', function ($scope, $localStorage,$site , $timeout , $user , $location, $next_item , $state, $stateParams, $modal, $filter, Restangular, toastr, Upload) {
    $scope.template_data = {
        title: 'Post',
        cancel_route: 'admin.site.content.blog.posts',
        success_route: 'admin.site.content.blog.posts',
        transcript: false,
        access_choice: false
    }
    var draft;
    var changed;
    if($location.search().clone){
        delete $next_item.id;
        delete $next_item.access;
        delete $next_item.site;
    }

    $scope.next_item = $next_item;

    $scope.next_item.id ? $scope.page_title = 'Edit post' : $scope.page_title = 'Create post';

    var seo = {};
    if ($scope.next_item.seo_settings) {
        $.each($scope.next_item.seo_settings, function (key, data) {
            seo[data.meta_key] = data.meta_value;

        });
    }
    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };
    if ($scope.next_item.end_published_date)
        $scope.next_item.end_published_date = new Date(moment($scope.next_item.end_published_date).format('l'));
    else
        $scope.next_item.end_published_date = null;
    if ($scope.next_item.published_date)
    {
        $scope.next_item.published_date = new Date(moment($scope.next_item.published_date).format('l'));
    } else {
        $scope.next_item.published_date = new Date();
        $scope.next_item.published_date.setSeconds(0);
        $scope.next_item.published_date.setMilliseconds(0);
    }
    $scope.next_item.seo_settings = seo;
    Restangular.all('post').customGET('getMostUsed/'+$site.id).then(function(response){
        $scope.next_item.most_used_categories = response.most_used_categories;
        $scope.next_item.most_used_tags = response.most_used_tags;
    })

    $scope.saveAsDraft = function () {
        if( $scope.next_item.permalink == '' )
            this.onBlurTitle(null);

        console.log($scope.next_item.categories);
        delete $scope.next_item.most_used_categories;
        delete $scope.next_item.most_used_tags;
        delete $scope.next_item.access_level;
        if($scope.next_item.access_level_type!=2)
            $scope.next_item.access_level_id = 0;
        if ($scope.next_item.id) {
            
            $scope.next_item.put();
            $state.go("admin.site.content.blog.posts");
            toastr.success("Your post has been updated!");
        }
        else {
            Restangular.all('post').post($scope.next_item).then(function (post) {

                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                $scope.next_item = post;
                toastr.success("Post has been saved");
                $state.go("admin.site.content.blog.posts");
            });
        }
    }

    $scope.publish = function () {
        if( $scope.next_item.permalink == '' )
            this.onBlurTitle(null);

        delete $scope.next_item.most_used_categories;
        delete $scope.next_item.most_used_tags;
        delete $scope.next_item.access_level;
        $scope.next_item.access_level_type = 1;
        if ($scope.next_item.id) {

            $scope.next_item.put();
            $state.go("admin.site.content.blog.posts");
            toastr.success("Your post has been updated!");

        }
        else {
            Restangular.all('post').post($scope.next_item).then(function (post) {
                console.log("draft is this ");
                console.log(draft);
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                $scope.next_item = post;
                toastr.success("Post has been saved");
                $state.go("admin.site.content.blog.posts");
            });
        }
    }

    $scope.setPermalink = function ($event) {
        if (!$scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.title);
        $scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.permalink);
    }

    $scope.getFileName=function($url)
    {
      if($url){
          $str = $url.split("/");
            return $str[$str.length-1];
      }
    }

    $scope.imageUpload = function(files){

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    console.log(data.file_name);
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }
    //disabling for now because this isn't the draft feature we wanted
    if(false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'posts.content'}).then(function(response){
        if(response.length){
            draft = response[0]
            $scope.loadDraft()
        }
    })
    $scope.loadDraft = function(){
        var value = JSON.parse(draft.value);
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/loadDraft.html',
            controller: "modalController",
            scope: $scope,

        });
        modalInstance.result.then(function () {
            $scope.next_item = value;
        } , 
        function () {
          Restangular.one('draft' , draft.id).remove().then(function(res)
            {
                draft=null;
            });
        })
    }

    var timeout = null;
    $scope.$watch('post' , function(post , oldPost){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (post != oldPost && changed && !$scope.next_item.id && !$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $site.id , user_id : $user.id , key : 'posts.content' , value : JSON.stringify($scope.next_item)}
        Restangular.all('draft').post(data).then(function(response){
            draft=response;
            console.log("draft value chaneged");
            console.log(response);
        })
    }
});

app.controller('postsController', function ($scope, $localStorage, $state, $stateParams, $modal, $filter, Restangular, toastr) {
    $rootScope.page_title = 'Blogs';
});

app.controller('postController', function ($scope,$rootScope, $localStorage, $state, $stateParams, $modal, $filter, Restangular, toastr) {
    $scope.comment = '';
    $scope.child_comment = '';
    $scope.user = $localStorage.user;
    $scope.loading=true;

    Restangular.one('postByPermalink', $stateParams.permalink).get().then(function(response){
        $post=response;
        $scope.loading=false;
        $scope.post = $post;
        $scope.next_item = $scope.post;
        $rootScope.page_title = $post.title || $rootScope.page_title;
        if( $scope.post.access_level_type == 4 )
            $state.go('public.app.blog');
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