app.controller('VimeoVideoController',function($scope,$http,Restangular,toastr){
    $scope.addLesson = function (){
        var tag = ($scope.next_item.tags[0] != undefined) ?  tag = $scope.next_item.tags[0].tag : '';
        var featured_image = ($scope.next_item.pictures != undefined && $scope.next_item.pictures.sizes[3] != undefined) ? $scope.next_item.pictures.sizes[3].link : '';
        var lesson = {
            site_id: $scope.site.id,
            title: $scope.next_item.name,
            content: $scope.next_item.description ? $scope.next_item.description : $scope.next_item.name,
            featured_image: featured_image,
            embed_content: typeof $scope.next_item.embed.html != 'undefined' && $scope.next_item.embed.html != '' && $scope.next_item.embed.html != null ? $scope.next_item.embed.html : '<iframe src="https://player.vimeo.com/video/' + $scope.next_item.uri.split('/').pop() + '?badge=0&autopause=0&player_id=0" width="1280" height="720" frameborder="0" title="Affiliate Marketing Blueprint" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
            tag: tag,
            type: 'vimeo',
            access_level_type:4,
            access_level_id : 0,
            remote_id: $scope.next_item.uri
        };

        if ($scope.next_item.embed_presets){
            lesson['presenter'] = $scope.next_item.embed_presets.user.name;
        }

        Restangular.service('lesson').post(lesson).then(function(response){
            toastr.success("Lesson saved!");
            $scope.next_item.added = true;

        });
    }
});

app.controller('vimeoController', function ($scope, $rootScope, $http, Restangular, $videosAdded, toastr) {
    var lesson = Restangular.all("lesson");

    $scope.videos = false;
    $scope.vimeo_integrations = [];
    $scope.vimeo = {};
    $scope.selected_account = false;
    $scope.page = 1;
    $scope.wait = false;
    $scope.tags = [];

    //for new pagination

    $scope.itemsPerPage = 10;
    $scope.pagination = {currentPage : 1};

    $scope.paginateIt = function() {
        var begin = (($scope.pagination.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.videos_to_show = $scope.videos.data.slice(begin, end);
    }

    $scope.loadVideos = function(){
        if(!($scope.vimeo && $scope.vimeo.access_token ))
            return false;




        if (!$scope.wait){
            $scope.wait = true;
            $scope.callVimeo();
        }
    }

    $scope.callVimeo = function() {
        var user_id = $scope.vimeo.remote_id.toString();
        user_id = user_id.substring(7);
        var $url = "https://api.vimeo.com/users/" + user_id + "/videos?page="+$scope.page;
        $http.get($url,{headers: {'Authorization': 'Bearer ' + $scope.vimeo.access_token}})
            .then(function(response){
                if (response.status != '500' && $scope.page <= 3)
                {
                    if ($scope.videos){
                        if( response.data ) {
                            for (var i = 0; i < response.data.data.length; i++) {
                                $scope.videos.data.push(response.data.data[i]);
                            };
                        }
                    } else {
                        $scope.videos = response.data;
                    }
                    if($scope.selectedTag)
                        $scope.filter($scope.selectedTag);
                    $scope.checkAlreadyAdded();
                    $scope.page++;
                    $scope.callVimeo();
                } else {
                    $scope.wait = false;
                    $scope.paginateIt();
                }
            }, function(response)
            {
                $scope.wait = false;
                $scope.paginateIt();
            });
    }


    angular.forEach( $scope.site.integration, function(value,key){
        if( value.type == 'vimeo' )
            $scope.vimeo_integrations.push( value );
    });

    if( $scope.vimeo_integrations.length > 0 ) {
        var selected_integration = _.findWhere($scope.vimeo_integrations, {default: 1}) || _.findWhere( $scope.vimeo_integrations, {default: "1"});

        if( !selected_integration )
            selected_integration = $scope.vimeo_integrations[0];

        if( selected_integration ) {
            console.log(selected_integration);
            $scope.selected_account = selected_integration.id;
            $scope.vimeo.access_token = selected_integration.account.access_token;
            $scope.vimeo.remote_id = selected_integration.account.remote_id;
            $scope.loadVideos();
        }
    }

    $scope.setBackUrl = function(){
        $rootScope.vimeo_redirect_url = '/admin/site/content/imports';
    }


    $scope.filter = function(tag) {
        console.log(tag)
        console.log($scope.videos.data)
        $scope.selectedTag = tag;
        for (var i = $scope.videos.data.length - 1; i >= 0; i--) {
            $scope.videos.data[i].hide = false;
            var match = _.findWhere($scope.videos.data[i].tags,{tag: tag.tag});
            if(!match)
                $scope.videos.data[i].hide = true;
            else
                console.log(match)
        };
    }

    $scope.changeAccount = function(){
        console.log('Change account called');
        angular.forEach( $scope.videos.data, function( value ){
            if( value.added )
                $videosAdded.items.push({remote_id: value.uri })
        });
        console.log($scope.selected_account);
        var selected_integration = _.findWhere($scope.vimeo_integrations, {id: $scope.selected_account}) || _.findWhere( $scope.vimeo_integrations, {id: $scope.selected_account + ''});

        if( selected_integration ) {
            $scope.page = 1;
            $scope.wait = true;
            $scope.tags = [];
            $scope.vimeo = {};
            $scope.selected_account = selected_integration.id;
            $scope.vimeo.access_token = selected_integration.account.access_token;
            $scope.vimeo.remote_id = selected_integration.account.remote_id;
            $scope.videos = false;

            $scope.wait = false;
            console.log( 'what we using: ', $scope.vimeo );
            $scope.loadVideos();
        }
    }



    $scope.checkAlreadyAdded = function(){
        console.log('video data is here', $scope.videos.data);
        for (var i = 0; i < $scope.videos.data.length; i++) {
            var test = _.findWhere($videosAdded.items,{remote_id: $scope.videos.data[i].uri});

            for (var j = $scope.videos.data[i].tags.length - 1; j >= 0; j--) {
                var tag = $scope.videos.data[i].tags[j];
                var match = _.findWhere($scope.tags,{tag: tag.tag});
                if(!match)
                    $scope.tags.push(tag);
            };
            
            if(test){
                $scope.videos.data[i].added = true;
            }
        };
    }

    $scope.addAll = function(){
        var videosToAdd = [];
        for (var i = 0; i < $scope.videos.data.length; i++) {

            if(!$scope.videos.data[i].added && !$scope.videos.data[i].hide){
                videosToAdd.push($scope.videos.data[i]);
                $videosAdded.items.push({remote_id: $scope.videos.data[i].uri});
            }
        };
        lesson.customPOST(videosToAdd,'addAll').then(function(response){
            for (var i = 0; i < $scope.videos.data.length; i++) {
                if(!$scope.videos.data[i].added && !$scope.videos.data[i].hide)
                    $scope.videos.data[i].added = true;
            };
            $scope.selectedTag = null;
            toastr.success("All shown videos has been added");
        });


    }
    

    /*


    console.log($scope.vimeo);


    var vimeo = Restangular.all("vimeo");
    var lesson = Restangular.all("lesson");

    $scope.init = function () {

        Restangular.one("vimeo", "videos").get().then(function (response) {
            if(response)
            {
                $scope.vimeo_token = response.token;
                $scope.vimeo_videos = response.videos;
                if(response.summary_data)
                    $scope.tags = response.summary_data.tags;
            }
        })
    }

    $scope.removeVimeoToken = function () {
        vimeo.customDELETE("remove", {'token': $scope.vimeo_token}).then(function () {
            $scope.init();
        });
    }
    $scope.addLesson = function (video_id) {
        var videoWithId = _.find($scope.vimeo_videos, function (video) {
            return video.video_id === video_id;
        });

        l = $scope.setLessonProperties(videoWithId);        
        $scope.vimeo_videos = _.without($scope.vimeo_videos, videoWithId);

        lesson.post(l).then(function (response) {

        })

        //moduleWithId.remove().then(function () {
        //    $scope.vimeo_videos = _.without($scope.vimeo_videos, moduleWithId);
        //});
    }

    $scope.addAll = function(){
        toastr('Lessons are being created....');
        lesson.customPOST('','addAll').then(function(response){
            toastr('Lessons created');
            $scope.vimeo_videos.splice(0,$scope.vimeo_videos.length);
        });
    }

    $scope.setLessonProperties = function(video){
        var l = {};
        l.embed_content = video.embed_content;
        l.featured_image = video.featured_image;
        l.title = video.title;
        l.note = video.video_length;
        l.content = video.description || '';
        l.type = 'video';
        return l;
    }
    */
});