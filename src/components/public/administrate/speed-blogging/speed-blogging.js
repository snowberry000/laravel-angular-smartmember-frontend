var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.speed-blogging",{
			templateUrl: "/templates/components/public/administrate/speed-blogging/speed-blogging.html",
			controller: "SpeedBloggingController"
		})
}); 

app.controller("SpeedBloggingController", function ($scope, $rootScope, close, smModal, $localStorage, $filter) {

    if( $localStorage.speed_blogging_parameters ) {
        $rootScope.$_GET = $localStorage.speed_blogging_parameters;
        delete $localStorage.speed_blogging_parameters;
    }

    $scope.content_types = [
        {
            route: 'public.administrate.site.content.syllabus.lesson',
            icon: 'student',
            description: 'Lesson'
        },
        {
            route: 'public.administrate.site.content.blog.post',
            icon: 'rss',
            description: 'Post'
        },
        {
            route: 'public.administrate.site.pages.custom-page',
            icon: 'file text',
            description: 'Page'
        }
    ];

    $scope.next_item = {};

    $scope.next_item.content = $scope.next_item.content || '';

    $scope.loading = true;

    $scope.setPermalink = function( $event ) {
            $scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.title).toLowerCase();
    };

    angular.forEach( $rootScope.$_GET, function( value, key )
    {
        switch( key )
        {
            case 'src':
                switch( $rootScope.$_GET[ 'type' ] )
                {
                    case 'embed':
                        if( value.match( /www\.youtube\.com/ ) )
                        {
                            video_id = value.split( 'v=' )[ 1 ];
                            ampersandPosition = video_id.indexOf( '&' );
                            if( ampersandPosition != -1 )
                            {
                                video_id = video_id.substring( 0, ampersandPosition );
                            }
                            $scope.next_item.embed_content = '<iframe src="https://www.youtube.com/embed/' + video_id + '" allowfullscreen frameborder="0"></iframe>';
                            $scope.next_item.featured_image = 'http://img.youtube.com/vi/' + video_id + '/0.jpg';
                            $.ajax( {
                                url: 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBdolPnARgmjt4K5xz-FJ3V5_N5_7A_QeU&part=snippet&id=' + video_id,
                                dataType: "json",
                                async: false,
                                success: function( data )
                                {
                                    if( typeof data.items[ 0 ] != 'undefined' && typeof data.items[ 0 ].snippet != 'undefined' )
                                    {
                                        $scope.next_item.content += data.items[ 0 ].snippet.description;
                                        $scope.next_item.title = data.items[ 0 ].snippet.title;
                                    }

                                    $scope.loading = false;
                                    $scope.addSource();
                                    $scope.setPermalink();
                                }
                            } );
                        }
                        else if( value.match( /vimeo\.com/ ) )
                        {
                            matches = value.match( /player\.vimeo\.com\/video\/([0-9]*)/ );

                            video_id = matches[ 1 ];

                            $scope.next_item.embed_content = '<iframe src="https://player.vimeo.com/video/' + video_id + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

                            $.ajax( {
                                url: 'http://vimeo.com/api/v2/video/' + video_id + '.json',
                                dataType: 'jsonp',
                                async: false,
                                success: function( json_data )
                                {
                                    $scope.next_item.featured_image = json_data[ 0 ].thumbnail_large;
                                    $scope.next_item.content += json_data[ 0 ].description;
                                    $scope.next_item.title = json_data[ 0 ].title;

                                    $scope.loading = false;
                                    $scope.addSource();
                                    $scope.setPermalink();
                                }
                            } );
                        }
                        else
                        {
                            $scope.loading = false;
                            $scope.addSource();
                            $scope.setPermalink();
                        }
                        break;
                    case 'image':
                        $scope.next_item.featured_image = value;
                        $scope.next_item.content += '<img src="' + value + '" />';
                        break;
                }
                break;
            case 'title':
                $scope.next_item.title = value.replace(/<\/?[^>]+>/gi, "");
                $scope.next_item.title = $scope.next_item.title.trim();
                $scope.setPermalink();
                break;
            case 'content':
            case 'description':
                $scope.next_item.content += '<br>' + value;
                break;
            case 'featured_image':
                $scope.next_item.featured_image = value;
                break;
            case 'image':
                if( !$scope.next_item.title || $scope.next_item.title.trim() == '' ) {
                    $scope.next_item.title = value.split('/').pop();
                    $scope.setPermalink();
                }
                $scope.next_item.content += '<img src="' + value + '" />';
                $scope.next_item.featured_image = value;
                break;
        }
    } );

    $scope.addSource = function() {
        angular.forEach($rootScope.$_GET, function (value, key) {
            switch (key) {
                case 'source_title':
                    if ($rootScope.$_GET['source_url']) {
                        $scope.next_item.content += '<br>Source: <a href="' + $rootScope.$_GET['source_url'] + '" target="_blank">' + value + '</a>';
                    } else {
                        $scope.next_item.content += 'Source: ' + value;
                    }
                    break;
                case 'source_url':
                    if ($rootScope.$_GET['source_title']) {

                    } else {
                        $scope.next_item.content += 'Source: ' + value;
                    }
                    break;
            }
        });
    }

    if( !$rootScope.$_GET['type'] || $rootScope.$_GET['type'] != 'embed' ) {
        $scope.loading = false;
        $scope.addSource();
    }
});