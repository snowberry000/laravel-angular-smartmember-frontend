app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider
        .state('admin.site.content',{
            url:'/content',
            templateUrl: 'templates/admin/site/content/index.html'
        })
        .state('admin.site.content.import', {
            url: '/imports',
            templateUrl: 'templates/admin/site/content/import.html',
            controller: 'vimeoController',
            resolve: {
                $videosAdded: function(Restangular){
                    return Restangular.all('').customGET('lesson?type=vimeo&bypass_paging=true');
                }
            }
        })
	    .state('admin.site.content.stats',{
		    url:'/reporting',
		    templateUrl: 'templates/admin/site/content/stats.html',
		    controller: 'SiteContentSummaryController',
		    resolve : {
			    summary : function (Restangular) {
				    return Restangular.all('site').customGET('summary');
			    },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'angular-flot'
                        }
                    ]);
                }
		    }
	    })

});
