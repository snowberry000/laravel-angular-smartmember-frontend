var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.content.import",{
			url: "/import",
			templateUrl: "/templates/components/admin/site/content/import/import.html",
			controller: "ImportController",
            resolve: {
                $videosAdded: function(Restangular){
                    return Restangular.all('').customGET('lesson?type=vimeo&bypass_paging=true');
                }
            }
		})
}); 

app.controller("ImportController", function ($scope, $rootScope, $http, Restangular, $videosAdded, toastr) {
	var lesson = Restangular.all("lesson");

    $scope.videos = false;
    $scope.vimeo_integrations = [];
    $scope.vimeo = {};
    $scope.selected_account = false;
    $scope.page = 1;
    $scope.wait = false;
    $scope.tags = [];

    $scope.loadVideos = function(){
        if(!($scope.vimeo && $scope.vimeo.access_token ))
            return false;
        var user_id = $scope.vimeo.remote_id.toString();
        user_id = user_id.substring(7);

        var $url = "https://api.vimeo.com/users/" + user_id + "/videos?page="+$scope.page;

        if (!$scope.wait){
            $scope.wait = true;
            $http.get($url,{headers: {'Authorization': 'Bearer ' + $scope.vimeo.access_token}})
                .success(function(response){
                    if ($scope.videos){
                        if( response.data ) {
                            for (var i = 0; i < response.data.length; i++) {
                                $scope.videos.data.push(response.data[i]);
                            };
                        }
                    } else {
                        $scope.videos = response;
                    }
                    if($scope.selectedTag)
                        $scope.filter($scope.selectedTag);
                    $scope.checkAlreadyAdded();
                    $scope.page++;

                    if( response.data )
                        $scope.wait = false;
                });
        }
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
    
});