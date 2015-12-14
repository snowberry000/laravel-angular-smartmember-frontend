app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider
        .state('admin.site.content.blog', {
            url: '/blog',
            templateUrl: 'templates/admin/site/content/blog/index.html',
        })
        .state('admin.site.content.blog.posts', {
            url: '/posts',
            templateUrl: 'templates/admin/site/content/blog/posts.html',
            controller: 'adminPostsController'
        })
        .state('admin.site.content.blog.post', {
            url: '/post/:id?',
            templateUrl: 'templates/admin/site/content/blog/post.html',
            controller: 'adminPostController',
            resolve: {
                $next_item: function(Restangular, $site , $stateParams , $location) {
                    if($stateParams.id)
                        return Restangular.one('post' , $stateParams.id).get();
                    else if($location.search().clone){
                        return Restangular.one('post', $location.search().clone).get();
                    }
                    else
                        return {site_id : $site.id , access_level_type : 4}
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
