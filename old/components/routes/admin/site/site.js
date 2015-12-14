app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {

    $stateProvider

        .state('admin.site', {
            url: '/site',
            templateUrl: 'templates/admin/site/index.html',
            controller : ''
        })
        .state( 'admin.site.dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/admin/site/dashboard.html'
        } )
        .state( 'admin.site.wizards', {
            url: '/wizard',
            templateUrl: 'templates/admin/site/wizard/wizards.html',
            controller : 'WizardsController',
            resolve: {
                $wizards: function( Wizards ){
                    return Wizards.GetAll();
                },
                $wizards_server : function( Restangular , $site){
                    return Restangular.all('wizard').customGET('',{is_completed : 1 , site_id : $site.id})
                }
            }
        } )
        .state( 'admin.site.wizard', {
            url: '/wizard/:id',
            templateUrl: 'templates/admin/site/wizard/wizard.html',
            controller : 'WizardController',
            resolve: {
                $nodes : function(Nodes){
                    return Nodes.GetAll();
                },
                $wizard: function( Wizards , $stateParams){
                    return Wizards.GetCurrent($stateParams.id);
                },
                $wizard_server : function( Restangular , $stateParams , $site){
                    return Restangular.all('wizard').customGET('',{slug :$stateParams.id , site_id : $site.id})
                }
            }
        } )
});