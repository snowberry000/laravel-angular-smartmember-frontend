app.controller('lessonsController', function ($scope, $rootScope, $localStorage,  $state, $stateParams,$modal, $filter, Restangular, toastr,$location) {


    $scope.lesson_count = 0;
    $rootScope.page_title = 'Lessons';
    $scope.loading=true;
    
    $scope.salesPage=window.location.hash.substr(1);
    

    if($scope.site.show_syllabus_toggle)
    {
        if ($localStorage.syllabus_format){
            $scope.site.syllabus_format = $localStorage.syllabus_format;
        }
    }
    else
    {
        delete $localStorage.syllabus_format;
    }

    Restangular.one('module', 'home').get().then(function(response){
        $scope.loading=false;
        $modules=response;
        $scope.modules = $modules;
        $scope.modules = _.reject($scope.modules,function($mod){
            return $mod.lessons.length==0;
        });
        $.each($scope.modules, function (key, data) {
            $.each(data.lessons, function (key, data) {
                $scope.lesson_count++;
                data.showCounter=$scope.lesson_count;
                switch(parseInt(data.access_level_type)){
                    case 1:
                        data.access = 'Public';
                        break;
                    case 2:
                        data.access = data.access_level !== undefined && data.access_level !== null && data.access_level.name !== undefined ? data.access_level.name : '';
                        break;
                    case 3:
                        data.access = 'Members';
                        break;
                    case 4:
                        data.access = 'Draft (admin-only)';
                        break;
                }
                if (data.content != undefined && typeof(data.content) == "string")
                    data.description = $scope.excerpt( data.content );
                else
                    data.description = data.content;
            });
            data.lessons = _.toArray(data.lessons);
        });

        $rootScope.Modulelessons=[];
        for(var i=0;i<$scope.modules.length;i++)
        {   
            $rootScope.Modulelessons.push.apply( $rootScope.Modulelessons, $filter('orderBy')($scope.modules[i].lessons, 'sort_order') );
        }
    });
    
    $scope.cutString = function(s, n){
        var cut= s.indexOf(' ', n);
        if(cut== -1) return s;
        return s.substring(0, cut)
    }

    $scope.excerpt = function( string ) {
        return $scope.cutString( string.replace(/(<([^>]+)>)/ig,""), 200 );
    }
    

    $scope.showFormat = function(format){
        $localStorage.syllabus_format = format;
        $scope.site.syllabus_format = format;
    }

    
    $scope.assignCounter= function ($ctr)
    {
        $rootScope.showCounter=parseInt($ctr);
    }
    
});


app.controller('lessonController', function ($scope,$rootScope, $localStorage,$state , $stateParams,$modal, $filter, Restangular, toastr) {
    $scope.loading=true;
    $scope.comment = '';
    $scope.child_comment = '';

    $scope.TriggerEmbeds = function() {
        //$('.ui.embed').embed();
    }
    
    $lesson={};
    $scope.user = $localStorage.user;
    $index=0;

    Restangular.one('lessonByPermalink' , $stateParams.permalink).get().then(function(response){
        $lesson=response;
        $rootScope.page_title = $lesson.title || $rootScope.page_title;
        $scope.loading=false;
        $scope.lesson = $lesson;
        $scope.next_item = $scope.lesson;
        $scope.userNote = {lesson_id : $lesson.id , site_id : $lesson.site_id};
        $scope.lesson.new_reply = '';
        $scope.lesson.new_comment = '';

        if ($scope.$storage.user){
            Restangular.one('userNote').customGET('single/'+$lesson.id).then(function (note) {
                if(note)
                    $scope.userNote = note;
            });
        }
        Restangular.all('').customGET('comment?target_id='+$scope.lesson.id+'&type='+2).then(function(comments){
           $scope.lesson.comments = _.toArray(comments.comments)
        });

        if( $lesson != undefined && $lesson.id != undefined && $lesson.permalink != undefined && $stateParams.permalink == $lesson.id ) {
                $('body').append( $('<a>').attr('href','/lesson/' + $lesson.permalink) );
                $('body a:last').click().remove();
        }
        $scope.lesson.transcript_content_public == 1 ? $scope.lesson.transcript_content_public = true : $scope.lesson.transcript_content_public = false;
        

        if($rootScope.Modulelessons)
        {
            console.log("now here it is");
            $rootScope.showCounter = _.findLastIndex($rootScope.Modulelessons, {permalink: $stateParams.permalink})+1;
            $scope.showCounter=$rootScope.showCounter;
            $index=$scope.showCounter-1;
            $scope.assignNextPrev();
            $scope.lesson.total_lessons=$rootScope.Modulelessons.length;
        }
        else
        {
            console.log("here it is");
            Restangular.one('module', 'home').get().then(function(response){
                console.log(response);
                $scope.modules =response;// $filter('orderBy')(response, 'sort_order');
                $scope.modules = _.reject($scope.modules,function($mod){
                                return $mod.lessons.length==0;
                            });
                console.log($scope.modules);
                $rootScope.Modulelessons=[];
                console.log("length: "+$scope.modules.length);
                $.each($scope.modules, function (key, temp_module) {   
                    $modlessons=$filter('orderBy')(temp_module.lessons, 'sort_order');
                    $.each($modlessons, function (key, data) {
                        $rootScope.Modulelessons.push(data);
                    });
                });
                $rootScope.showCounter = _.findLastIndex($rootScope.Modulelessons, {permalink: $stateParams.permalink})+1;
                console.log("show counter: "+$rootScope.showCounter);
                $scope.showCounter = $rootScope.showCounter;
                $index=$scope.showCounter-1;
                $scope.lesson.total_lessons=$rootScope.Modulelessons.length;
                $scope.assignNextPrev();
            });
        }

        $scope.TriggerEmbeds();
    });

    

    

    $scope.assignCounter= function ($ctr)
    {
        $rootScope.showCounter=parseInt($ctr);
    }

    $scope.assignNextPrev =function()
    {
        if($index == 0)
        {
            $scope.lesson.prev_lesson=null;
        }
        else
        {
            $scope.lesson.prev_lesson=$rootScope.Modulelessons[$index-1];      
        }

        if($index+1 == $rootScope.Modulelessons.length)
        {
            $scope.lesson.next_lesson=null;
        }
        else
        {
            $scope.lesson.next_lesson=$rootScope.Modulelessons[$index+1];
        }
    }

    $scope.saveComment = function(body){
        if(!$scope.user){
            toastr.error("Sorry , you must be logged in to comment!");
            return;
        }
        Restangular.all('comment').post({target_id:$scope.lesson.id , type:2 ,body:body , public:$scope.lesson.discussion_settings.public_comments}).then(function(comment){
            $scope.lesson.comments.push(comment);
            $scope.lesson.new_comment = "";
            toastr.success("Your comment is added!");
        })
    }

    $scope.showReplyBox = function(comment){
        comment.show_reply_div = !comment.show_reply_div ; 
        $('#comment_reply_25').focus()
    }

    $scope.deleteComment = function(comment){
        if(!$scope.user.id == comment.user_id){
            toastr.error("Sorry , you are not authorized to remove this comment");
            return;
        }
        Restangular.one('comment' , comment.id).remove().then(function(response){
            $scope.lesson.comments = _.without($scope.lesson.comments, comment);
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

    $scope.saveReply = function(comment , body){
        if(!$scope.user){
            toastr.error("Sorry , you must be logged in to comment");
            return;
        }
        Restangular.all('comment').post({target_id:$scope.lesson.id , type:2 , parent_id : comment.id ,body:body , public:$scope.lesson.discussion_settings.public_comments}).then(function(reply){
            comment.reply.push(reply);
            comment.new_reply = '';
            toastr.success("Your reply is reply added!!");
        })
    }

    $scope.commentPermission = function(){
        return ($scope.lesson.discussion_settings.show_comments && !$scope.lesson.discussion_settings.close_to_new_comments);
    }

    $scope.replyPermission = function(){
        if($scope.commentPermission());
        return ($scope.lesson.discussion_settings.show_comments && !$scope.lesson.discussion_settings.close_to_new_comments && $scope.lesson.discussion_settings.allow_replies );
    }

    
    $scope.saveNote = function () {
        if(!$scope.lesson.access){
            toastr.error("You do not have access to this content");
            return;
        }
        if(!$localStorage.user){
            toastr.error("You must be logged in to save notes");
            return;
        }
       
       if(!$scope.userNote.note)
       {
        toastr.error("Note is empty can note be saved!");
        return;
       }

        if($scope.userNote.id){
            $scope.userNote.put();
        }else{
            Restangular.all('userNote').post($scope.userNote).then(function (note) {
                $scope.userNote = note;
            });
        }
        toastr.success("Note has been saved!");
    }

    $scope.saveNoteAndToggleComplete = function () {
        if(!$scope.lesson.access){
            toastr.error("You do not have access to this content");
            return;
        }
        if(!$localStorage.user){
            toastr.error("You must be logged in to save notes");
            return;
        }

        if(!$scope.userNote.note)
        {
            toastr.error("Note is empty can note be saved!");
            return;
        }

        $scope.userNote.complete = !$scope.userNote.complete;
        
        if($scope.userNote.id){
            $scope.userNote.put();
            if($scope.userNote.complete){
                toastr.success("Note has been saved and marked complete");
            }
            else{
                toastr.success("Note has been saved and marked incomplete");
            }
        }else{
            Restangular.all('userNote').post($scope.userNote).then(function (note) {
                $scope.userNote = note;
                if($scope.userNote.complete){
                    toastr.success("Note has been saved and marked complete");
                }
                else{
                    toastr.error("Note has been saved and marked incomplete");
                }
            });
        }
    }
});

app.controller('adminLessonsController', function ($scope, $localStorage, $site , $state, $stateParams,$modal, $filter, Restangular, toastr) {
    $scope.template_data = {
        title: 'LESSONS',
        description: 'Add lessons to your site for members to read / watch / hear.',
        singular: 'lesson',
        edit_route: 'admin.site.content.syllabus.lesson',
        api_object: 'lesson'
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

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' )).then(function (data) {
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

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then(function(data){
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
        });
    };
});


app.controller('moduleCreatorModel', function ($scope, Restangular, toastr) {
    
});


app.controller('adminLessonController', function ($scope, $rootScope, $localStorage, $timeout ,  $state, $next_item , $location, $stateParams,$modal,$site , $user , $filter, Restangular, toastr, $modules,Upload) {
    $scope.template_data = {
        title: 'Lesson',
        cancel_route: 'admin.site.content.syllabus.lessons',
        success_route: 'admin.site.content.syllabus.lessons'
    }

    $scope.strip_tags = function(input, allowed) {
        allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '')
            .replace(tags, function($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
    }

    $scope.getUrlVars = function() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = decodeURIComponent(value);
        });
        return vars;
    }

    var $_GET = $scope.getUrlVars();

    var interval ;
    var draft;
    var changed;
    $scope.func= function ()
    {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/moduleCreator.html',
            controller: "modalController",
            scope: $scope
        });
        modalInstance.result.then(function () {
            alert("result called");
        })
    }

    if($location.search().clone){
        delete $next_item.id;
        delete $next_item.author_id;
        delete $next_item.access;
    }


    if($modules.items.length>0)
        $scope.modules=$modules.items;
    else
        $scope.modules=null;
    $scope.newModule={};
    $scope.options.theme = '';

    $scope.next_item = $next_item;

    //speed blogging stuff here
    if( !$scope.next_item.id )
    {
        $scope.next_item.content = $scope.next_item.content || '';

        angular.forEach($_GET,function(value,key){
            switch( key ) {
                case 'src':
                    switch( $_GET['type'] ) {
                        case 'embed':
                            if (value.match(/www\.youtube\.com/)) {
                                var video_id = value.split('v=')[1];
                                var ampersandPosition = video_id.indexOf('&');
                                if (ampersandPosition != -1) {
                                    video_id = video_id.substring(0, ampersandPosition);
                                }
                                $scope.next_item.embed_content = '<iframe src="https://www.youtube.com/embed/' + video_id + '" allowfullscreen frameborder="0"></iframe>';
                                $scope.next_item.featured_image = 'http://img.youtube.com/vi/' + video_id + '/0.jpg';
                                $.ajax({
                                    url: 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBdolPnARgmjt4K5xz-FJ3V5_N5_7A_QeU&part=snippet&id=' + video_id,
                                    dataType: "json",
                                    async: false,
                                    success: function (data) {
                                        if (typeof data.items[0] != 'undefined' && typeof data.items[0].snippet != 'undefined') {
                                            $scope.next_item.content += data.items[0].snippet.description;
                                            $scope.next_item.title = data.items[0].snippet.title;
                                        }
                                    }
                                });
                            }
                            else if (value.match(/vimeo\.com/)) {
                                var matches = value.match(/player\.vimeo\.com\/video\/([0-9]*)/);

                                var video_id = matches[1];

                                $.ajax({
                                    url: 'http://vimeo.com/api/v2/video/' + video_id + '.json',
                                    dataType: 'jsonp',
                                    async: false,
                                    success: function (json_data) {
                                        $scope.next_item.featured_image = json_data[0].thumbnail_large;
                                        $scope.next_item.content += json_data[0].description;
                                        $scope.next_item.title = json_data[0].title;
                                    }
                                });
                            }
                            break;
                        case 'image':
                            $scope.next_item.featured_image = value;
                            $scope.next_item.content += '<img src="' + value + '" />';
                            break;
                    }
                    break;
                case 'title':
                    $scope.next_item.title = $scope.strip_tags( value );
                    $scope.next_item.title = $scope.lesson.title.trim();
                    break;
                case 'content':
                case 'description':
                    $scope.next_item.content += '<br>' + value;
                    break;
                case 'featured_image':
                    $scope.next_item.featured_image = value;
                    break;
                case 'image':
                    $scope.next_item.title = value.split('/').pop();
                    $scope.next_item.content += '<img src="' + value + '" />';
                    $scope.next_item.featured_image = value;
                    break;
            }
        });

        angular.forEach($_GET,function(value,key){
            switch( key ) {
                case 'source_title':
                    if( $_GET['source_url'] )
                        $scope.next_item.content += '<br>Source: <a href="' + $_GET['source_url'] + '" target="_blank">' + value + '</a>';
                    break;
            }
        });
    }

    $scope.next_item.dripfeed_settings = $next_item.dripfeed || {};
    if ($scope.next_item.published_date)
    {
        $scope.next_item.published_date = new Date(moment($scope.next_item.published_date).format('l'));
    } else {
        $scope.next_item.published_date = new Date();
        $scope.next_item.published_date.setSeconds(0);
        $scope.next_item.published_date.setMilliseconds(0);
    }
    if ($scope.next_item.end_published_date)
        $scope.next_item.end_published_date = new Date(moment($scope.next_item.end_published_date).format('l'));
    else
        $scope.next_item.end_published_date = null;

    $scope.next_item.discussion_settings = $next_item.discussion_settings || {};
    $scope.next_item.id ? $scope.page_title = 'Edit lesson' : $scope.page_title = 'Create lesson';
    $scope.next_item.transcript_content_public == 1 ? $scope.next_item.transcript_content_public = true : $scope.next_item.transcript_content_public = false;
    $scope.next_item.access_level_type = parseInt( $scope.next_item.access_level_type );
    $scope.next_item.access_level_id = parseInt( $scope.next_item.access_level_id );

    if( $scope.next_item.access_level_type == 3 )
        $scope.next_item.access_level_type = 2;

    var seo = {};
    if ($next_item.seo_settings) {
        $.each($next_item.seo_settings, function (key, data) {
            seo[data.meta_key] = data.meta_value;

        });
    }
    $scope.next_item.seo_settings = seo;
    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };


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

    $scope.changeModule = function($mod)
    {
        for(var i=0;i<$modules.items.length;i++)
        {
            if($modules.items[i].title==$mod)
            {
                $scope.next_item.module_id=$modules.items[i].id;
                break;
            }
        }
    }

    $scope.setPermalink = function ($event) {
        if(!$scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.title);
        $scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
    }

    $scope.setPermalink();

    $scope.onBlurSlug = function ($event) {
        if ($scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.permalink);
    }

    $scope.saveModule = function ($model) {
        Restangular.all('module').post($model).then(function (module) {
            if($scope.modules)
                $scope.modules.push(module);
            else
            {
                $scope.modules=[];
                $scope.modules.push(module);
            }
            toastr.success("Module has been saved");
            $scope.isOpen = false;
        });
    }
    $scope.getFileName=function($url)
    {
      if($url){
          str = $url.split("/");
          if (str) {
            str = str[str.length-1];
            tkns = str.split(".")
            if (tkns.length > 0)
                tkns.splice(0, 1);

            return tkns.join('.');
          }
      }
    }

    $scope.save = function () {
        delete $scope.next_item.prev_lesson;
        delete $scope.next_item.next_lesson;
        delete $scope.next_item.total_lessons;
        delete $scope.next_item.access_level;
        delete $scope.next_item.current_index;
        delete $scope.next_item.module;
        delete $scope.next_item.site;


        $scope.next_item.title=$scope.next_item.title.trim();

        if( $scope.next_item.permalink == '' )
            this.setPermalink(null);

        $scope.next_item.permalink=$scope.next_item.permalink.trim();
        $callback = "";

        if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
            $scope.next_item.access_level_type = 3;

        if($scope.next_item.access_level_type!=2)
            $scope.next_item.access_level_id = 0;
        if ($scope.next_item.id) {
            $callback = $scope.next_item.put();
        }else {
            $callback = Restangular.all('lesson').post($scope.next_item);
        }
        
        $callback.then(function(lesson){
            if(draft)
                Restangular.one('draft' , draft.id).remove();
            $scope.next_item = lesson;
            toastr.success("Lesson has been saved");
            if($rootScope.syllabus_redirect_url){
                $state.go($rootScope.syllabus_redirect_url);
                $rootScope.syllabus_redirect_url = '';
            }else{
                $state.go( $scope.template_data.success_route );
            }
        })

    }
    //disabling for now as this is not the draft feature we wanted.
    if( false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'lessons.content'}).then(function(response){
        if(response.length){
            draft = response[0];
            $scope.loadDraft();
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
            //$scope.start();
        } , 
        function () {
          Restangular.one('draft' , draft.id).remove().then(function(res)
            {
                draft=null;
            });
          //$scope.start();
        })
    }
    var timeout = null;
    $scope.$watch('lesson' , function(lesson , oldLesson){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (lesson != oldLesson && changed && !$scope.next_item.id && !$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $site.id , user_id : $user.id , key : 'lessons.content' , value : JSON.stringify($scope.next_item)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }
});