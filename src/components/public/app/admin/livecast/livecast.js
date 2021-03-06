var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.livecast",{
			url: "/livecast/:id?",
			templateUrl: "/templates/components/public/app/admin/livecast/livecast.html",
			controller: "LivecastController"
		})
}); 

app.controller("LivecastController", function ($scope,$http,$timeout , $rootScope , smModal , Restangular,$state, $location, $stateParams , $filter, Upload, toastr) {
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');

	var draft;
    var changed;
    $scope.site = $site = $rootScope.site;
    $user = $rootScope.user;

    

    $scope.initialize = function(){
        if(!$scope.next_item.id){
            $scope.next_item.site_id = $scope.site.id;
        }

        if($location.search().clone){
            delete $scope.next_item.id;
            delete $scope.next_item.access;
            delete $scope.next_item.author_id;
            delete $scope.next_item.site;
        }

        if (!Modernizr.inputtypes.date) {

          // no native support for <input type="date"> :(
          // maybe build one yourself with Dojo or jQueryUI
            if($stateParams.id != ""){
                $('.scheduled_date').datepicker();
                $('.scheduled_date').datepicker("option", "dateFormat", 'yy-mm-dd');
            }else{
                setTimeout(function(){
                $('.scheduled_date').datepicker();
                $('.scheduled_date').datepicker("option", "dateFormat", 'yy-mm-dd');
                },500);
            }

        }

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

        if ($scope.next_item.end_published_date)
            $scope.next_item.end_published_date = new Date(moment.utc($scope.next_item.end_published_date));
        else
            $scope.next_item.end_published_date = null;

        if ($scope.next_item.published_date)
        {
            $scope.next_item.published_date = new Date(moment.utc($scope.next_item.published_date));
        } else {
            $scope.next_item.published_date = new Date();
            $scope.next_item.published_date.setSeconds(0);
            $scope.next_item.published_date.setMilliseconds(0);
        }
        $scope.next_item.access_level_type = parseInt( $scope.next_item.access_level_type );
        $scope.next_item.access_level_id = parseInt( $scope.next_item.access_level_id );

        if( $scope.next_item.access_level_type == 3 )
            $scope.next_item.access_level_type = 2;

        $scope.next_item.id ? $scope.page_title = 'Edit livecast' : $scope.page_title = 'Create livecast';
        $scope.next_item.discussion_settings = $scope.next_item.discussion_settings || {};
        var seo = {};
        if ($scope.next_item.seo_settings) {
            $.each($scope.next_item.seo_settings, function (key, data) {
                seo[data.meta_key] = data.meta_value;
            });
        }
        $scope.next_item.seo_settings = seo;

    }

    if ( $stateParams.id ) {
        $next_item = Restangular.one('livecast', $stateParams.id).get().then(function(response){$scope.next_item = response , $scope.initialize()});
    }
    else if($location.search().clone){
        $next_item = Restangular.one('livecast', $location.search().clone).get().then(function(response){$scope.next_item = response , $scope.initialize()});
    }
    else{
        $scope.next_item = {access_level_type : 4, access_level_id: 0};
        $scope.initialize();
    }

    $scope.template_data = {
        title: 'Livecast',
        cancel_route: 'public.app.admin.livecasts',
        success_route: 'public.app.admin.livecasts',
        transcript: false
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

    
    //$scope.next_item.dripfeed_settings = $next_item.dripfeed || {};
    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

    $scope.setPermalink = function ($event) {
        if(!$scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.title).toLowerCase();
        if(!$scope.next_item.seo_settings.fb_share_title)
            $scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
    }

    
    $scope.onBlurTitle = function ($event) {
        if (!$scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.title);
        $scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.next_item.permalink)
            $scope.next_item.permalink = $filter('urlify')($scope.next_item.permalink);
    }

    $scope.save = function()
    {
        if( $scope.next_item.permalink == '' ){
            this.onBlurTitle(null);
        }

        if( $scope.next_item.permalink == '' || !$scope.next_item.permalink){
            toastr.error("Please enter valid permalink");
            return;
        }

        delete $scope.next_item.access_level;

        if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
            $scope.next_item.access_level_type = 3;

        if($scope.next_item.access_level_type!=2)
            $scope.next_item.access_level_id = 0;
        if($scope.next_item.id){
            $scope.next_item.put().then(function(){
                $state.go('public.app.admin.livecasts');
                toastr.success("Livecast updated!");
                // $state.transitionTo($state.current, $state.params, { 
                //   reload: true, inherit: false, location: false
                // });
            });
        }
        else{
            Restangular.all('livecast').post($scope.next_item).then(function(response){
                if(draft)
                    Restangular.one('draft' , draft.id).remove();
                $state.go('public.app.admin.livecasts');
                toastr.success("Livecast Created!");
                // $state.transitionTo($state.current, $state.params, { 
                //   reload: true, inherit: false, location: false
                // });

            })
        }
    }

    //disabling for now because this isn't the draft feature we wanted
    if( false && !$stateParams.id && !$location.search().clone)
    Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'livecasts.content'}).then(function(response){
        if(response.length){
            draft = response[0];
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
    $scope.$watch('livecast' , function(livecast , oldLivecast){
        if(typeof changed == "undefined")
            changed = false;
        else
            changed = true;
        if (livecast != oldLivecast && changed && !$scope.next_item.id && !$$location.search().clone) {
              if (timeout) {
                $timeout.cancel(timeout)
              }
              timeout = $timeout($scope.start, 3000);  // 1000 = 1 second
            }
    } , true)

    $scope.start = function(){
        var data = {site_id : $site.id , user_id : $user.id , key : 'livecasts.content' , value : JSON.stringify($scope.next_item)}
        Restangular.all('draft').post(data).then(function(response){
            console.log(response);
            draft=response;
        })
    }

});