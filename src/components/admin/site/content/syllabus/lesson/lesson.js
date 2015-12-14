var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content.syllabus.lesson",{
			url: "/lesson/:id?",
			templateUrl: "/templates/components/admin/site/content/syllabus/lesson/lesson.html",
			controller: "LessonController",
            resolve: {
                $next_item: function(Restangular, $site , $stateParams , $location) {
                    if($stateParams.id) {
                        return Restangular.one('lesson', $stateParams.id).get();
                    }else if($location.search().clone){
                        return Restangular.one('lesson', $location.search().clone).get();
                    }
                    else
                        return {site_id : $site.id , access_level_type : 4, access_level_id : 0}
                },
                $modules: function(Restangular) {
                    return Restangular.all('module').customGET('');
                },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'summernote'
                        }
                    ]);
                }
            }
		})
}); 

app.controller("LessonController", function ($scope, $rootScope, $localStorage, $timeout ,  $state, $next_item , $location, $stateParams,$modal,$site , $user , $filter, Restangular, toastr, $modules,Upload) {
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