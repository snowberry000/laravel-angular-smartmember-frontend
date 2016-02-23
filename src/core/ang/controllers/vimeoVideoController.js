app.controller('VimeoVideoController',function($scope,$http,Restangular,toastr , $state){
    $scope.addLesson = function (){
        var tag = ($scope.next_item.tags[0] != undefined) ?  tag = $scope.next_item.tags[0].tag : '';
        var featured_image = ($scope.next_item.pictures != undefined && $scope.next_item.pictures.sizes[3] != undefined) ? $scope.next_item.pictures.sizes[3].link : '';
        var lesson = {
            site_id: $scope.site.id,
            title: $scope.next_item.name.replace(/[\/\\#,+()'":*?<>{}]/g,'-'),
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
            $state.transitionTo($state.current , {} , {
                reload : true , inherit : false , location : false
            })

        });
    }
});