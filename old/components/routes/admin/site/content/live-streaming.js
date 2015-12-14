app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider

        .state('admin.site.content.livecasts',{
            url: '/livecasts',
            templateUrl: 'templates/admin/site/content/livecasts/livecasts.html',
            controller: 'adminLivecastsController'
        })

        .state('admin.site.content.livecast',{
            url: '/livecast/:id?',
            templateUrl: 'templates/admin/site/content/livecasts/livecast.html',
            controller: 'adminLivecastController',
            resolve: {
                $next_item: function(Restangular, $stateParams, $site , $location) {
                    if ( $stateParams.id ) {
                        return Restangular.one('livecast', $stateParams.id).get();
                    }
                    else if($location.search().clone){
                        return Restangular.one('livecast', $location.search().clone).get();
                    }
                    return {site_id: $site.id , access_level_type : 4, access_level_id: 0};
                }
            }
        })


});
