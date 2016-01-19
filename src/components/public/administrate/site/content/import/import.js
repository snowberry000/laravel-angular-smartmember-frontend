var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content.import",{
			url: "/import",
			templateUrl: "/templates/components/public/administrate/site/content/import/import.html",
			controller: "ImportController",
            resolve: {
                $videosAdded: function(Restangular){
                    return Restangular.all('').customGET('lesson?type=vimeo&bypass_paging=true');
                }
            }
		})
}); 

app.controller("ImportController", function ($scope, $rootScope, $http, Restangular, toastr , $state) {
	var lesson = Restangular.all("lesson");
    $scope.loading = true;
    $scope.videos = false;
    $scope.vimeo_app_configurations = [];
    $scope.vimeo = {};
    $scope.selected_account = false;
    $scope.page = 1;
    $scope.wait = false;
    $scope.tags = [];
      $scope.pagination = {
        current_page: 1,
        per_page: 50,
        total_count: 0
    };

    //for new pagination
    $scope.site = $rootScope.site;
    console.log('This is site', $scope.site);
    $scope.pagination.per_page = 50;

 

    $scope.$watch( 'pagination.current_page', function( new_value, old_value )
    {
        if( new_value != old_value )
        {
            $scope.callVimeo();
        }
    } );


    $scope.paginateIt = function() {
        var begin = (($scope.pagination.current_page - 1) * $scope.pagination.per_page),
            end = begin + $scope.pagination.per_page;

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
        var $url = "https://api.vimeo.com/users/" + user_id + "/videos?page="+$scope.pagination.current_page +"&per_page=50";
        $http.get($url,{headers: {'Authorization': 'Bearer ' + $scope.vimeo.access_token}})
            .then(function(response){
                if (response.status != '500')
                {

                    if ($scope.videos){
                        if( response.data ) {
                             $scope.videos_to_show =response.data.data;
                            for (var i = 0; i < response.data.data.length; i++) {
                                $scope.videos.data.push(response.data.data[i]);
                            };
                        }
                    } else {
                        $scope.videos = response.data;
                    }

                    $scope.pagination.total_count =response.data.total;
                    if($scope.selectedTag)
                        $scope.filter($scope.selectedTag);
                    $scope.checkAlreadyAdded();
                    $scope.page++;
                    $scope.wait = false;
                    $scope.videos_to_show =response.data.data;
                    //$scope.paginateIt();
                } else {
                    $scope.wait = false;
                    $scope.videos_to_show =response.data.data;
                    //$scope.paginateIt();
                }
            }, function(response)
            {
                $scope.wait = false;
                $scope.videos_to_show =response.data.data;
            //    $scope.paginateIt();
            });
    }

    $scope.initialize = function(){

        $scope.site.configured_app = _.sortBy($scope.site.configured_app , function(item){
            return -item.id;
        })
        angular.forEach( $scope.site.configured_app, function(value,key){
            if( value.type == 'vimeo' && value.account)
            {
                $scope.vimeo_app_configurations.push( value );
            }

        });
        $scope.loading = false;
        if( $scope.vimeo_app_configurations.length > 0 ) {
            var selected_integration = _.findWhere($scope.vimeo_app_configurations, {default: 1}) || _.findWhere( $scope.vimeo_app_configurations, {default: "1"});

            if( !selected_integration || !selected_integration.account || !selected_integration.account.access_token )
                selected_integration = $scope.vimeo_app_configurations[0];

            if( selected_integration && selected_integration.account && selected_integration.account.access_token ) {
                console.log('yes');
                $scope.selected_account = selected_integration.id;
                $scope.vimeo.access_token = selected_integration.account.access_token;
                $scope.vimeo.remote_id = selected_integration.account.remote_id;
                
                $scope.loadVideos();
            }
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

    $scope.changeAccount = function(selected_account){
        selected_account = parseInt(selected_account);
        console.log('Change account called');
        angular.forEach( $scope.videos.data, function( value ){
            if( value.added )
                $videosAdded.items.push({remote_id: value.uri })
        });
        console.log(selected_account);
        var selected_integration = _.findWhere($scope.vimeo_app_configurations, {id: selected_account}) || _.findWhere( $scope.vimeo_app_configurations, {id: selected_account + ''});

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

    Restangular.all('').customGET('lesson?type=vimeo&bypass_paging=true').then(function(response){
        $videosAdded = response;
        $scope.initialize();
    })

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
            $state.transitionTo($state.current , $state.params , {
                reload : true , inherit : false , location : false
            })
        });


    }
    
});