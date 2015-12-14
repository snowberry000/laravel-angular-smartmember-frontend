app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {

    $stateProvider
        .state('admin.account', {
            url: '/account',
            templateUrl: 'templates/admin/account/index.html',
            controller : 'AccountController'
        })
        .state('admin.account.memberships', {
            url: '/memberships',
            templateUrl: 'templates/admin/account/memberships.html' ,
            controller: 'DirectoryController',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'wu.masonry'
                        }
                    ]);
                }
            }
        })
        .state('admin.account.settings', {
            url: '/settings',
            templateUrl: 'templates/admin/account/settings.html',
        })
        .state('admin.account.profile', {
            url: '/profile',
            templateUrl: 'templates/admin/account/profile.html',
        })
        .state('admin.account.photo', {
            url: '/photo',
            templateUrl: 'templates/admin/account/photo.html',
        })
});