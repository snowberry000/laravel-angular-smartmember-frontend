

app.controller('adminPagesCoreController', function ( $scope ) {

	$scope.data = [
        /*
		{
			title: 'Helpdesk',
			description: 'This is the main "help" area of your site. Visitors and members alike will go here to get help ' +
			'in the form of articles and support tickets',
			image: '',
			template: 'helpdesk',
			url: '/support'
		},
        */
		{
			title: 'Download Center',
			description: 'This page will show all available downloads to visitors and members to access.',
			image: '',
			template: 'download-center',
			url: '/download-center'
		},
		{
			title: 'Home Page',
			description: 'This page is the "featured" area of your site. Each theme has a different home page featuring different aspects of your site.',
			image: '',
			template: 'home',
			url: '/'
		},
		{
			title: 'Sales Page',
			description: 'This is your sites "sales" page, providing a more effective call-to-action for your site than the Home Page does.',
			image: '',
			template: 'info',
			url: '/info#preview'
		},
		{
			title: 'JV Page',
			description: 'This page allows affiliates / joint venture (jv) partners to learn about your site and optin to join its Email List.',
			image: '',
			template: 'jv',
			url: '/jvpage'
		},
		{
			title: 'Refund Page',
			description: 'When requesting a refund, members can be directed to this page as last attempt to prevent the refund. From ' +
			'there they can submit a refund request support ticket or be presented with a Freebie to stay on board.',
			image: '',
			template: 'refund',
			url: '/refund-page'
		},
		{
			title: 'Freebie Page',
			description: 'When requesting a refund, members can choose to accept a free gift to stay onboard; this page ' +
			'is where they\'ll receive that gift.',
			image: '',
			template: 'freebie',
			url: '/free-bonus'
		},
		{
			title: 'Syllabus',
			description: 'This page lists your sites lessons and modules in an organized "education" style format.',
			image: '',
			template: 'syllabus',
			url: '/lessons'
		},
		{
			title: 'Login Page',
			description: 'This is the page your members will use to log into your site',
			image: '',
			template: 'login',
			url: '/sign/in'
		},
		{
			title: 'Registration Page',
			description: 'This is the page your members will use to join your site',
			image: '',
			template: '',
			url: '/sign/up'
		},
	];

});

app.controller('adminPagesController', function ($scope, $localStorage, $site, $state, $stateParams, $modal, $filter, Restangular, toastr) {
    $scope.template_data = {
        title: 'PAGES',
        description: 'Create pages to fill your site with content for your members to read / watch / hear.',
        singular: 'page',
        edit_route: 'admin.site.pages.custom-page',
        api_object: 'customPage'
    }

    var page = Restangular.all("customPage");

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

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
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

app.controller('adminPageController', function ($scope, $rootScope, $localStorage, $location, $site , $timeout , $user , $next_item ,$state, $stateParams, $modal, $filter, Restangular, toastr, Upload) {

    $scope.template_data = {
        title: 'Pages',
        cancel_route: 'admin.pages.pages'
    }
    var draft;
    var changed;
    if($location.search().clone){
        delete $next_item.id;
        delete $next_item.access;
        delete $next_item.site;

    }

    $scope.next_item = $next_item;

    $scope.next_item.id ? $scope.page_title = 'Edit page' : $scope.page_title = 'Create page';
    $scope.next_item.access_level_type = parseInt( $scope.next_item.access_level_type );
    $scope.next_item.access_level_id = parseInt( $scope.next_item.access_level_id );

    if( $scope.next_item.access_level_type == 3 )
        $scope.next_item.access_level_type = 2;

    var seo = {};
    if ($scope.next_item.seo_settings) {
        $.each($next_item.seo_settings, function (key, data) {
            seo[data.meta_key] = data.meta_value;
        });
    }
    $scope.next_item.seo_settings = seo;

    $scope.imageUpload = function(files , type){
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    var editor = $.summernote.eventHandler.getModule();

                    $scope.next_item[ type ] += '<img src=\''+data.file_name+'\'>';
                    console.log('do we gots editable now? ', $scope.editable );
                    //$scope.editable seems to be undefined, not sure why
                    /*
                     if(type=='transcript')
                     editor.insertImage( $scope.editable2, data.file_name);
                     else
                     editor.insertImage( $scope.editable, data.file_name);
                     */
                }).error(function (data, status, headers, config) {
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

    $scope.save = function () {
        delete $scope.next_item.access_level;

        if( $scope.next_item.permalink == '' )
            this.onBlurTitle(null);

        $scope.next_item.site_id = $site.id;

        if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
            $scope.next_item.access_level_type = 3;

        if($scope.next_item.access_level_type!=2)
            $scope.next_item.access_level_id = 0;
        if ($scope.next_item.id) {
            $scope.next_item.put();
            $state.go("admin.site.pages.custom-pages");
            toastr.success("Page has been updated!");
        }
        else {
            Restangular.all('customPage').post($scope.next_item).then(function (page) {
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                $scope.next_item = page;
                $state.go("admin.site.pages.custom-pages");
                toastr.success("Custom page has been saved!");
            });
        }

    }

    //disabling for now because this wasn't the draft feature we wanted
    if(false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'pages.content'}).then(function(response){
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
    $scope.$watch('page' , function(page , oldPage){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (page != oldPage && changed && !$scope.page.id && !$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $site.id , user_id : $user.id , key : 'pages.content' , value : JSON.stringify($scope.page)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }
});

app.controller('pageController', function ($scope, $localStorage,$rootScope, $state, $stateParams, $modal, $filter, Restangular, toastr) {
    
    $scope.comment = '';
    $scope.child_comment = '';
    $scope.user = $localStorage.user;
    $scope.loading = true;
    

    Restangular.one('pageByPermalink', $stateParams.permalink).get().then(function(response){
        $scope.loading=false;
        $page=response;
        $scope.page = $page;
        $scope.next_item = $scope.page;
        $rootScope.page_title = $page.title || $rootScope.page_title;
        Restangular.all('').customGET('comment?target_id='+$scope.page.id+'&type='+1).then(function(comments){
           $scope.page.comments = _.toArray(comments.comments);
        });
    });

    

    $scope.saveComment = function(body){
        if(!$scope.user){
            toastr.error("Sorry , you must be logged in to commen");
            return;
        }
        Restangular.all('comment').post({target_id:$scope.page.id , type:1 ,body:body , public:$scope.page.discussion_settings.public_comments}).then(function(comment){
            $scope.page.comments.push(comment);
            toastr.success("Your comment is added!");

        })
    }

    $scope.saveReply = function(comment , body){
        if(!$scope.user){
            toastr.error("Sorry , you must be logged in to comment");
            return;
        }
        Restangular.all('comment').post({target_id:$scope.page.id , type:1 , parent_id : comment.id ,body:body , public:$scope.page.discussion_settings.public_comments}).then(function(reply){
            comment.reply.push(reply);
            toastr.error("Your reply is added!");

        })
    }

    $scope.deleteComment = function(comment){
        if(!$scope.user.id == comment.user_id){
            toastr.error("Sorry , you are not authorized to remove this comment");
            return;
        }
        Restangular.one('comment' , comment.id).remove().then(function(response){
            $scope.page.comments = _.without($scope.page.comments, comment);
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
        return ($scope.page.discussion_settings.show_comments && !$scope.page.discussion_settings.close_to_new_comments);
    }

    $scope.replyPermission = function(){
        if($scope.commentPermission());
        return ($scope.page.discussion_settings.show_comments && !$scope.page.discussion_settings.close_to_new_comments && $scope.page.discussion_settings.allow_replies );
    }

    $scope.TriggerEmbeds = function() {
        $('.ui.embed').embed();
    }

});

app.controller('pagesController', function ($scope, $localStorage, $state, $stateParams, $modal, $filter, Restangular, toastr ) {
    //$scope.page = $page;
    $rootScope.page_title = 'Custom Pages';

});