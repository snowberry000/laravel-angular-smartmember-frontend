app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider
        .state('admin.site.content.downloads', {
            url: '/downloads',
            templateUrl: 'templates/admin/site/content/downloads/downloads.html',
            controller: 'adminDownloadsController',
            resolve: {
                $downloads: function(Restangular, $site) {
                    return Restangular.all('').customGET('download');
                }
            }
        })
        .state('admin.site.content.download', {
            url: '/download/:id?',
            templateUrl: 'templates/admin/site/content/downloads/download.html',
            controller: 'adminDownloadController',
            resolve: {
                $download: function(Restangular, $site , $stateParams , $location) {
                    if($stateParams.id)
                        return Restangular.one('download' , $stateParams.id).get();
                    else if($location.search().clone){
                        return Restangular.one('download', $location.search().clone).get();
                    }
                    else
                        return {site_id : $site.id , access_level_type : 4, access_level_id : 0}
                }
            }
        })

});
