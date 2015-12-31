app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider
        .state('app',{
            templateUrl: '/templates/home.html',
        })
        .state('app.landing', {
            url: '/',
            templateUrl: '/templates/landing.html',
            controller: 'LandingController',
        })
    
        .state('app.software', {
            url: '/software',
            templateUrl: '/templates/software/list.html',
            controller: 'SoftwareController',
        })
        .state('app.pricing', {
            url: '/pricing',
            templateUrl: '/templates/pricing/list.html',
            controller: 'PricingController',
        })
        .state('app.thanks', {
            url: '/thanks',
            templateUrl: '/templates/pricing/thanks.html',
            controller: 'PricingController',
        })
        .state('app.policies', {
            url: '/policies',
            templateUrl: '/templates/policy/policies.html',
            controller: 'TOSController',
        })
        .state('app.terms-of-service', {
            url: '/terms-of-service',
            templateUrl: '/templates/policy/tos.html',
            controller: 'TOSController',
        })
        .state('app.privacy-policy', {
            url: '/privacy-policy',
            templateUrl: '/templates/policy/privacy-policy.html',
            controller: 'TOSController',
        })
        .state('app.transparency-report', {
            url: '/transparency-report',
            templateUrl: '/templates/policy/transparency-report.html',
            controller: 'TOSController',
        })
        .state('app.user-data-request-policy', {
            url: '/user-data-request-policy',
            templateUrl: '/templates/policy/user-data-request-policy.html',
            controller: 'TOSController',
        })
        .state('app.blog', {
            url: '/blog',
            templateUrl: '/templates/blog/list.html',
            controller: 'BlogsController',
            resolve: {
                $blogPosts: function (Restangular) {
                    return Restangular.all('getBlogPosts').getList();
                }
            }
        })
        .state('app.singleBlog', {
            url: '/blog/:permalink',
            templateUrl: '/templates/blog/single.html',
            controller: 'BlogController',
            resolve: {
                $blogPost : function($stateParams , Restangular){
                    return Restangular.one('blogPostByPermalink', $stateParams.permalink).get();
                }
            }
        })
        .state('app.course',{
            url: '/course/:permalink',
            templateUrl: '/templates/course/index.html',
            controller: 'CourseController',
            resolve: {
                $course: function($stateParams, Restangular){
                    return Restangular.one('directoryByPermalink',$stateParams.permalink).get();
                }
            }
        })
        .state('app.team',{
            url: '/team/:permalink',
            templateUrl: '/templates/team/index.html',
            controller: 'TeamController',
            resolve: {
                $team: function($stateParams, Restangular){
                    return Restangular.one('companyByPermalink',$stateParams.permalink).get();
                }
            }
        })


});