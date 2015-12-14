app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    // uiZeroclipConfigProvider.setZcConf({
    //   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
    // });

    $stateProvider
        .state('my', {
            url: '/my',
            templateUrl: 'templates/admin/admin.html',
            controller : 'MyController',
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $user: function(Restangular,$localStorage){
                    if ($localStorage.user){
                        return Restangular.one('user',$localStorage.user.id).get();
                    }
                    return [];
                },
                $company : function(Restangular , $stateParams){
                    return Restangular.one('company/getCurrentCompany').get();
                }
            }
        })
        .state('my.resource',{
            url: '/resource',
            template: '<ui-view></ui-view>'
        })




});